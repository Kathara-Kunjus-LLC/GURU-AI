const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

function findMdFiles(dir) {
  const results = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
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

function resolveGraph(nodes, rawEdges) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const domainSet = new Set(nodes.map(n => n.domain).filter(Boolean))

  // Condition 2: appears in builds-into from 2+ distinct domains
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
    // Condition 2
    const srcDomains = buildsIntoSources.get(node.id)
    if (srcDomains && srcDomains.size >= 2) {
      node.isBridge = true
      continue
    }
    // Condition 1: scan Bridge section for known domain strings
    const section = extractSection(node.content, 'bridge to other domains')
    if (section) {
      const sectionLower = section.toLowerCase()
      const hits = [...domainSet].filter(d => sectionLower.includes(d.toLowerCase()))
      if (hits.length >= 2) node.isBridge = true
    }
  }

  // Only keep edges where both ends exist
  const edges = rawEdges.filter(e => nodeMap.has(e.source) && nodeMap.has(e.target))

  return { nodes, edges }
}

function parseVault(vaultPath) {
  const files = findMdFiles(vaultPath)
  const nodes = []
  const rawEdges = []

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data: fm, content } = matter(raw)

      if (!fm.title) continue

      const node = {
        id: fm.title,
        title: fm.title,
        domain: fm.domain || '',
        parentDomain: fm['parent-domain'] || '',
        source: fm.source || '',
        filePath: path.relative(vaultPath, filePath),
        isBridge: false,
        content: content.trim(),
      }
      nodes.push(node)

      for (const target of parseLinks(fm.prereqs || [])) {
        rawEdges.push({ source: node.id, target, type: 'prereq' })
      }
      for (const target of parseLinks(fm['builds-into'] || [])) {
        rawEdges.push({ source: node.id, target, type: 'builds-into' })
      }
      for (const target of parseLinks(fm.related || [])) {
        rawEdges.push({ source: node.id, target, type: 'related' })
      }
    } catch (err) {
      console.error(`[WARN] Skipped: ${filePath} — ${err.message}`)
    }
  }

  return resolveGraph(nodes, rawEdges)
}

module.exports = { parseVault }
