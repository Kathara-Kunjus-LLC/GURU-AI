import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function findMdFiles(dir) {
  const results = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMdFiles(full))
    } else if (entry.name.endsWith('.md')) {
      results.push(full)
    }
  }
  return results
}

function extractSection(content, headingLower) {
  const lines = content.split('\n')
  let inSection = false
  const sectionLines = []
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (inSection) break
      if (line.replace(/^##\s+/, '').toLowerCase() === headingLower) {
        inSection = true
      }
    } else if (inSection) {
      sectionLines.push(line)
    }
  }
  return inSection ? sectionLines.join('\n') : null
}

function stripWikilink(s) {
  return s.replace(/^\[\[/, '').replace(/\]\]$/, '').trim()
}

function parseLinks(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map(stripWikilink).filter(Boolean)
}

function parseFile(filePath, vaultPath, isStaged = false) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data: fm, content } = matter(raw)
  if (!fm.title) return null

  const node = {
    id: fm.title,
    title: fm.title,
    domain: fm.domain || '',
    parentDomain: fm['parent-domain'] || '',
    source: fm.source || fm.sources || '',
    filePath: path.relative(vaultPath, filePath),
    isBridge: false,
    isStaged,
    content: content.trim(),
  }

  const edges = []
  for (const target of parseLinks(fm.prereqs || [])) {
    edges.push({ source: node.id, target, type: 'prereq' })
  }
  for (const target of parseLinks(fm['builds-into'] || [])) {
    edges.push({ source: node.id, target, type: 'builds-into' })
  }
  for (const target of parseLinks(fm.related || [])) {
    edges.push({ source: node.id, target, type: 'related' })
  }

  return { node, edges }
}

function resolveGraph(nodes, rawEdges) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const domainSet = new Set(nodes.map(n => n.domain).filter(Boolean))

  // Condition 2: appears in builds-into edges from 2+ distinct domains
  const buildsIntoSources = new Map()
  for (const e of rawEdges) {
    if (e.type === 'builds-into') {
      const src = nodeMap.get(e.source)
      if (src) {
        if (!buildsIntoSources.has(e.target)) buildsIntoSources.set(e.target, new Set())
        buildsIntoSources.get(e.target).add(src.domain)
      }
    }
  }

  for (const node of nodes) {
    node.isBridge = false

    // Condition 2
    const srcDomains = buildsIntoSources.get(node.id)
    if (srcDomains && srcDomains.size >= 2) {
      node.isBridge = true
      continue
    }

    // Condition 1: extract domain names from **→ Domain:** headings in Bridge section.
    // Falls back to substring search if the heading pattern finds no matches.
    const section = extractSection(node.content, 'bridge to other domains')
    if (section) {
      const headingPattern = /\*\*→\s*([^:*]+):/g
      const patternMatches = [...section.matchAll(headingPattern)]
        .map(m => m[1].trim().toLowerCase())

      let hits
      if (patternMatches.length > 0) {
        hits = [...domainSet].filter(d =>
          patternMatches.some(m => m === d.toLowerCase() || m.includes(d.toLowerCase()) || d.toLowerCase().includes(m))
        )
      } else {
        // Fallback: substring search
        const sectionLower = section.toLowerCase()
        hits = [...domainSet].filter(d => sectionLower.includes(d.toLowerCase()))
      }

      if (hits.length >= 2) node.isBridge = true
    }
  }

  const edges = rawEdges.filter(e => nodeMap.has(e.source) && nodeMap.has(e.target))
  return { nodes, edges }
}

// ---------------------------------------------------------------------------
// Full parse — used on startup and for staging preview
// ---------------------------------------------------------------------------

export function parseVault(vaultPath, stagingPath = null) {
  const files = findMdFiles(vaultPath)
  const nodes = []
  const rawEdges = []

  for (const filePath of files) {
    try {
      const result = parseFile(filePath, vaultPath, false)
      if (!result) continue
      nodes.push(result.node)
      rawEdges.push(...result.edges)
    } catch (err) {
      console.error(`[WARN] Skipped: ${filePath} — ${err.message}`)
    }
  }

  // Include staged notes if stagingPath is provided
  if (stagingPath) {
    const stagedFiles = findMdFiles(stagingPath)
    for (const filePath of stagedFiles) {
      try {
        const result = parseFile(filePath, vaultPath, true)
        if (!result) continue
        // Don't duplicate if a note with this title already exists in vault
        if (!nodes.find(n => n.id === result.node.id)) {
          nodes.push(result.node)
          rawEdges.push(...result.edges)
        }
      } catch (err) {
        console.error(`[WARN] Skipped staged: ${filePath} — ${err.message}`)
      }
    }
  }

  return resolveGraph(nodes, rawEdges)
}

// ---------------------------------------------------------------------------
// Incremental updates — used by the file watcher
// ---------------------------------------------------------------------------

export function addOrUpdateNote(filePath, vaultPath, graphCache) {
  try {
    const result = parseFile(filePath, vaultPath, false)
    if (!result) return graphCache

    const { node, edges } = result

    // Remove existing entry for this file if present
    const updated = removeNoteById(node.id, graphCache)

    updated.nodes.push(node)
    updated.edges.push(...edges)

    return resolveGraph(updated.nodes, updated.edges)
  } catch (err) {
    console.error(`[WARN] Could not update note: ${filePath} — ${err.message}`)
    return graphCache
  }
}

export function removeNote(filePath, vaultPath, graphCache) {
  try {
    // Derive the note id from the file — re-parse just the frontmatter title
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data: fm } = matter(raw)
    if (!fm.title) return graphCache
    return removeNoteById(fm.title, graphCache)
  } catch {
    // File already gone — fall back to path-based removal
    const relPath = path.relative(vaultPath, filePath)
    const node = graphCache.nodes.find(n => n.filePath === relPath)
    if (!node) return graphCache
    return removeNoteById(node.id, graphCache)
  }
}

function removeNoteById(id, graphCache) {
  const nodes = graphCache.nodes.filter(n => n.id !== id)
  const edges = graphCache.edges.filter(e => e.source !== id && e.target !== id)
  return { nodes, edges }
}
