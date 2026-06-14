import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn, execSync } from 'child_process'
import multer from 'multer'
import matter from 'gray-matter'
import morgan from 'morgan'
import { parseVault, addOrUpdateNote, removeNote } from './parser.js'
import { setupWatcher } from './watcher.js'
import * as jobs from './jobs.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// .env loader (no external dependency — simple KEY=VALUE parser)
// ---------------------------------------------------------------------------

function loadDotEnv(root) {
  const envPath = path.join(root, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !(key in process.env)) process.env[key] = value
  }
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const configPath = path.join(__dirname, '..', 'config.json')
if (!fs.existsSync(configPath)) {
  console.error(`[guru] config.json not found at ${configPath}`)
  console.error('[guru] Run: ln -sf ../config.json config.json  (from guru-ui/)')
  process.exit(1)
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

// Resolve project root by following the config symlink
let projectRoot
try {
  projectRoot = path.dirname(fs.realpathSync(configPath))
} catch {
  projectRoot = process.cwd()
}

loadDotEnv(projectRoot)

const vaultPath = path.resolve(projectRoot, config.vault_path)
const stagingPath = config.staging_path ? path.resolve(projectRoot, config.staging_path) : null
const pdfsPath = config.pdfs_path ? path.resolve(projectRoot, config.pdfs_path) : null
const cacheDir = path.join(projectRoot, 'cache')
const scriptsDir = path.join(projectRoot, 'scripts')

// ---------------------------------------------------------------------------
// Resolve Python interpreter (pipenv venv → .venv → python3 fallback)
// ---------------------------------------------------------------------------

function resolvePython(root) {
  // Augment PATH so pipenv/brew Python are found regardless of how Node was started
  const augmentedEnv = {
    ...process.env,
    PATH: [
      process.env.PATH,
      '/opt/homebrew/bin',
      '/usr/local/bin',
      '/usr/bin',
    ].filter(Boolean).join(':'),
  }

  // Pipfile present → ask pipenv for its venv path
  if (fs.existsSync(path.join(root, 'Pipfile'))) {
    try {
      const venv = execSync('pipenv --venv', {
        cwd: root,
        encoding: 'utf-8',
        env: augmentedEnv,
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim()
      const py = path.join(venv, 'bin', 'python3')
      if (fs.existsSync(py)) {
        console.log(`[guru] Python: ${py}  (pipenv venv)`)
        return py
      }
    } catch {}
    console.warn('[guru] Pipfile found but no pipenv venv — run: brew install python@3.12 && pipenv install')
  }

  // .venv in project root
  const dotVenv = path.join(root, '.venv', 'bin', 'python3')
  if (fs.existsSync(dotVenv)) {
    console.log(`[guru] Python: ${dotVenv}  (.venv)`)
    return dotVenv
  }

  console.log('[guru] Python: python3  (system fallback)')
  return 'python3'
}

export const PYTHON = resolvePython(projectRoot)

if (!config.vault_path) {
  console.error('[guru] config.json is missing "vault_path"')
  process.exit(1)
}

try {
  fs.accessSync(vaultPath)
} catch {
  console.error(`[guru] vault_path not found: ${vaultPath}`)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  next()
})
app.options('*', (req, res) => res.sendStatus(200))

// ---------------------------------------------------------------------------
// Multer — PDF upload
// ---------------------------------------------------------------------------

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!pdfsPath) return cb(new Error('pdfs_path not configured'), null)
    fs.mkdirSync(pdfsPath, { recursive: true })
    cb(null, pdfsPath)
  },
  filename: (req, file, cb) => cb(null, file.originalname),
})

const upload = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')
    cb(null, ok)
  },
})

// ---------------------------------------------------------------------------
// Graph cache
// ---------------------------------------------------------------------------

let graphCache = { nodes: [], edges: [] }

function refresh() {
  try {
    graphCache = parseVault(vaultPath)
    console.log(`[guru] Parsed ${graphCache.nodes.length} notes, ${graphCache.edges.length} edges`)
  } catch (err) {
    console.error(`[guru] Parse error: ${err.message}`)
  }
}

refresh()

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

function readConceptsCache() {
  const p = path.join(cacheDir, 'concepts.json')
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) } catch { return {} }
}

function writeConceptsCache(data) {
  fs.mkdirSync(cacheDir, { recursive: true })
  fs.writeFileSync(path.join(cacheDir, 'concepts.json'), JSON.stringify(data, null, 2))
}

function readDomainsCache() {
  const p = path.join(cacheDir, 'domains.json')
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) } catch { return {} }
}

function writeDomainsCache(data) {
  fs.mkdirSync(cacheDir, { recursive: true })
  fs.writeFileSync(path.join(cacheDir, 'domains.json'), JSON.stringify(data, null, 2))
}

function extractPlainEnglish(content) {
  const m = content.match(/## Plain English\s*\n+([^\n]+)/)
  return m ? m[1].trim() : ''
}

// ---------------------------------------------------------------------------
// Staging helpers
// ---------------------------------------------------------------------------

function findMdFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...findMdFiles(full))
    else if (entry.name.endsWith('.md')) results.push(full)
  }
  return results
}

function listStaged(concepts) {
  if (!stagingPath) return []
  const files = findMdFiles(stagingPath)
  return files.map(filePath => {
    const rel = path.relative(stagingPath, filePath)
    const parts = rel.split(path.sep)
    const chapterDir = parts.length > 1 ? parts[0] : ''
    const filename = parts[parts.length - 1]
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data: fm } = matter(raw)
      return {
        path: rel.replace(/\\/g, '/'),
        chapterDir,
        filename,
        title: fm.title || filename.replace('.md', ''),
        domain: fm.domain || '',
        parentDomain: fm['parent-domain'] || '',
        source: fm.source || '',
        isConflict: Boolean(fm.title && concepts[fm.title]),
      }
    } catch {
      return { path: rel.replace(/\\/g, '/'), chapterDir, filename, title: filename.replace('.md', ''), domain: '', parentDomain: '', source: '', isConflict: false }
    }
  })
}

// ---------------------------------------------------------------------------
// Merge logic (conflict: existing vault note + staged note)
// ---------------------------------------------------------------------------

function mergeNotes(existingContent, stagedContent) {
  const existing = matter(existingContent)
  const staged = matter(stagedContent)

  const fm = { ...existing.data }

  // Convert source → sources list
  const existingSource = fm.source || ''
  const stagedSource = staged.data.source || ''
  if (existingSource && stagedSource && existingSource !== stagedSource) {
    delete fm.source
    const existingList = Array.isArray(existingSource) ? existingSource : [existingSource]
    const stagedList = Array.isArray(stagedSource) ? stagedSource : [stagedSource]
    fm.sources = [...new Set([...existingList, ...stagedList])].filter(Boolean)
  }

  let body = existing.content.trim()

  // Append new Bridge entries not already in existing
  const stagedBridgeMatch = staged.content.match(/## Bridge to Other Domains\s*\n([\s\S]*?)(?=\n## |\s*$)/)
  const existingBridgeMatch = existing.content.match(/## Bridge to Other Domains\s*\n([\s\S]*?)(?=\n## |\s*$)/)
  if (stagedBridgeMatch && existingBridgeMatch) {
    const stagedEntries = (stagedBridgeMatch[1].match(/> \*\*→[^\n]+(?:\n>[^\n]+)*/g) || [])
    const existingBridgeText = existingBridgeMatch[1]
    const newEntries = stagedEntries.filter(e => {
      const domainMatch = e.match(/→ ([^:]+):/)
      return domainMatch && !existingBridgeText.includes(domainMatch[1].trim())
    })
    if (newEntries.length > 0) {
      body = body.replace(
        /(## Bridge to Other Domains\s*\n[\s\S]*?)(?=\n## |\s*$)/,
        m => m.trimEnd() + '\n\n' + newEntries.join('\n\n') + '\n'
      )
    }
  }

  // Append Additional Source Notes section
  if (!body.includes('## Additional Source Notes')) {
    const stagedSource2 = staged.data.source || 'additional source'
    body += `\n\n## Additional Source Notes\n\n*From ${stagedSource2}:*\n\n${staged.content.trim()}`
  }

  return matter.stringify(body, fm)
}

// ---------------------------------------------------------------------------
// Spawn helper for extract.py (awaited)
// ---------------------------------------------------------------------------

function runExtract(filename) {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON, [path.join(scriptsDir, 'extract.py'), filename], { cwd: projectRoot })
    const lines = []
    proc.stdout.on('data', d => lines.push(...d.toString().split('\n').filter(l => l.trim())))
    proc.stderr.on('data', d => lines.push(...d.toString().split('\n').filter(l => l.trim())))
    proc.on('close', code => {
      if (code !== 0) return reject(new Error(lines.join('\n')))
      resolve(lines)
    })
    proc.on('error', reject)
  })
}

// ---------------------------------------------------------------------------
// Existing routes
// ---------------------------------------------------------------------------

app.get('/api/graph', (req, res) => {
  if (req.query.include === 'staging' && stagingPath) {
    try {
      const withStaging = parseVault(vaultPath, stagingPath)
      return res.json(withStaging)
    } catch (err) {
      console.error(`[guru] Staging parse error: ${err.message}`)
    }
  }
  res.json(graphCache)
})

app.get('/api/note/:title', (req, res) => {
  const title = decodeURIComponent(req.params.title)
  const node = graphCache.nodes.find(n => n.id === title)
  if (!node) return res.status(404).json({ error: 'Not found' })

  const absPath = path.join(vaultPath, node.filePath)
  try {
    res.json({ ...node, rawContent: fs.readFileSync(absPath, 'utf-8') })
  } catch (err) {
    res.status(500).json({ error: `Could not read file: ${err.message}` })
  }
})

// ---------------------------------------------------------------------------
// Pipeline routes
// ---------------------------------------------------------------------------

app.post('/api/pipeline/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF file provided or invalid file type' })
  res.json({ filename: req.file.originalname, size: req.file.size, saved: true })
})

app.post('/api/pipeline/extract', async (req, res) => {
  const { filename } = req.body
  if (!filename) return res.status(400).json({ error: 'filename required' })

  try {
    const lines = await runExtract(filename)

    // Derive book slug from extract output: "Slug:     applied-linear-algebra"
    const slugLine = lines.find(l => l.startsWith('Slug:'))
    const bookSlug = slugLine ? slugLine.replace('Slug:', '').trim() : null
    if (!bookSlug) return res.status(500).json({ error: 'Could not determine book slug', logs: lines })

    // Read meta.json
    const metaPath = path.join(projectRoot, 'pdfs', 'cache', bookSlug, 'meta.json')
    if (!fs.existsSync(metaPath)) return res.status(500).json({ error: 'meta.json not found after extract', logs: lines })

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    const chapters = Object.entries(meta.chapters).map(([num, ch]) => ({
      number: parseInt(num),
      title: ch.title,
      estimatedTokens: ch.estimated_tokens,
      startPage: ch.start_page,
      endPage: ch.end_page,
    })).sort((a, b) => a.number - b.number)

    res.json({ bookSlug, bookTitle: meta.title, author: meta.author, totalPages: meta.total_pages, chapters, logs: lines })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/pipeline/books', (req, res) => {
  if (!pdfsPath) return res.json([])
  const cacheDir = path.join(pdfsPath, 'cache')
  if (!fs.existsSync(cacheDir)) return res.json([])
  const books = []
  for (const slug of fs.readdirSync(cacheDir)) {
    const metaPath = path.join(cacheDir, slug, 'meta.json')
    if (!fs.existsSync(metaPath)) continue
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      const chapters = Object.entries(meta.chapters).map(([num, ch]) => ({
        number: parseInt(num),
        title: ch.title,
        estimatedTokens: ch.estimated_tokens,
        startPage: ch.start_page,
        endPage: ch.end_page,
      })).sort((a, b) => a.number - b.number)
      books.push({ bookSlug: slug, bookTitle: meta.title, author: meta.author, totalPages: meta.total_pages, chapters })
    } catch {}
  }
  res.json(books)
})

// ---------------------------------------------------------------------------
// Job routes
// ---------------------------------------------------------------------------

app.get('/api/jobs', (req, res) => {
  res.json(jobs.getAllJobs())
})

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.getJobWithLogs(req.params.id)
  if (!job) return res.status(404).json({ error: 'Not found' })
  res.json(job)
})

app.post('/api/jobs', (req, res) => {
  const { bookSlug, bookTitle, chapter, chapterTitle } = req.body
  if (!bookSlug || !chapter) return res.status(400).json({ error: 'bookSlug and chapter required' })
  const job = jobs.createJob({ bookSlug, bookTitle, chapter, chapterTitle })
  jobs.enqueue(job)
  res.status(201).json(job)
})

app.post('/api/jobs/:id/resume', (req, res) => {
  const job = jobs.requeueJob(req.params.id)
  if (!job) return res.status(400).json({ error: 'Job not found or not resumable' })
  res.json(jobs.getJobWithLogs(req.params.id))
})

app.delete('/api/jobs/:id', (req, res) => {
  const ok = jobs.deleteJob(req.params.id)
  if (!ok) return res.status(400).json({ error: 'Job not found or currently running' })
  res.json({ ok: true })
})

app.delete('/api/jobs', (req, res) => {
  const { filter = 'inactive' } = req.query
  const count = jobs.clearJobs(filter)
  res.json({ deleted: count })
})

app.get('/api/jobs/:id/stream', (req, res) => {
  const job = jobs.getJob(req.params.id)
  if (!job) return res.status(404).json({ error: 'Not found' })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()

  jobs.addSseClient(req.params.id, res)
  req.on('close', () => jobs.removeSseClient(req.params.id, res))
})

// ---------------------------------------------------------------------------
// Staging routes
// ---------------------------------------------------------------------------

app.get('/api/staging', (req, res) => {
  const concepts = readConceptsCache()
  res.json(listStaged(concepts))
})

app.get('/api/staging/note', (req, res) => {
  const notePath = req.query.path
  if (!notePath || !stagingPath) return res.status(400).json({ error: 'path query param required' })
  const absPath = path.join(stagingPath, notePath)
  if (!absPath.startsWith(stagingPath)) return res.status(400).json({ error: 'Invalid path' })
  try {
    const content = fs.readFileSync(absPath, 'utf-8')
    const { data: frontmatter } = matter(content)
    res.json({ path: notePath, content, frontmatter })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

app.patch('/api/staging/note', (req, res) => {
  const notePath = req.query.path
  const { content } = req.body
  if (!notePath || !stagingPath || !content) return res.status(400).json({ error: 'path and content required' })
  const absPath = path.join(stagingPath, notePath)
  if (!absPath.startsWith(stagingPath)) return res.status(400).json({ error: 'Invalid path' })
  try {
    fs.writeFileSync(absPath, content, 'utf-8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/staging/note', (req, res) => {
  const notePath = req.query.path
  if (!notePath || !stagingPath) return res.status(400).json({ error: 'path required' })
  const absPath = path.join(stagingPath, notePath)
  if (!absPath.startsWith(stagingPath)) return res.status(400).json({ error: 'Invalid path' })
  try {
    fs.unlinkSync(absPath)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------------------------------------------------------------------------
// Approve route
// ---------------------------------------------------------------------------

app.post('/api/approve', async (req, res) => {
  const { decisions = [], newDomains = {} } = req.body
  if (!stagingPath) return res.status(400).json({ error: 'staging_path not configured' })

  const concepts = readConceptsCache()
  const domains = readDomainsCache()
  const result = { moved: 0, merged: 0, rejected: 0, errors: [] }

  for (const decision of decisions) {
    const { path: notePath, action } = decision
    const absStaging = path.join(stagingPath, notePath)
    if (!absStaging.startsWith(stagingPath)) continue

    if (action === 'reject') {
      try {
        fs.unlinkSync(absStaging)
        result.rejected++
      } catch (err) {
        result.errors.push({ path: notePath, error: err.message })
      }
      continue
    }

    if (action !== 'approve') continue

    try {
      const stagedContent = fs.readFileSync(absStaging, 'utf-8')
      const { data: fm } = matter(stagedContent)
      const title = fm.title
      const domain = fm.domain || 'general'
      const parentDomain = fm['parent-domain'] || ''
      const filename = path.basename(absStaging)

      if (!title) {
        result.errors.push({ path: notePath, error: 'No title in frontmatter' })
        continue
      }

      const destDir = path.join(vaultPath, domain)
      const destPath = path.join(destDir, filename)
      fs.mkdirSync(destDir, { recursive: true })

      const isConflict = Boolean(concepts[title])

      if (isConflict) {
        // Merge: read existing vault note and merge
        const existingPath = path.join(vaultPath, concepts[title].path)
        let existingContent = ''
        try { existingContent = fs.readFileSync(existingPath, 'utf-8') } catch {}
        const merged = mergeNotes(existingContent, stagedContent)
        fs.writeFileSync(existingPath, merged, 'utf-8')
        result.merged++
      } else {
        fs.copyFileSync(absStaging, destPath)
        result.moved++
      }

      fs.unlinkSync(absStaging)

      // Update concepts cache
      const summary = extractPlainEnglish(stagedContent)
      const relVaultPath = isConflict ? concepts[title].path : path.join(domain, filename).replace(/\\/g, '/')
      concepts[title] = { path: relVaultPath, domain, 'parent-domain': parentDomain, summary }

      // Spawn embed.py --update async (don't block response)
      spawn(PYTHON, [path.join(scriptsDir, 'embed.py'), '--update', title], { cwd: projectRoot })
        .on('error', () => {})

    } catch (err) {
      result.errors.push({ path: notePath, error: err.message })
    }
  }

  // Add confirmed new domains
  for (const [domain, parent] of Object.entries(newDomains)) {
    if (domain && parent) domains[domain] = parent
  }

  writeConceptsCache(concepts)
  writeDomainsCache(domains)

  // Broadcast vault refresh
  broadcastRefresh()

  res.json(result)
})

// ---------------------------------------------------------------------------
// WebSocket + watcher
// ---------------------------------------------------------------------------

const server = createServer(app)
const wss = new WebSocketServer({ server })

jobs.init(wss, projectRoot, PYTHON)

function broadcastRefresh() {
  refresh()
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'refresh', data: graphCache }))
    }
  })
}

setupWatcher(vaultPath, {
  onAdd: filePath => {
    graphCache = addOrUpdateNote(filePath, vaultPath, graphCache)
    console.log(`[guru] Added: ${path.relative(vaultPath, filePath)}`)
    wss.clients.forEach(c => c.readyState === 1 && c.send(JSON.stringify({ type: 'refresh', data: graphCache })))
  },
  onChange: filePath => {
    graphCache = addOrUpdateNote(filePath, vaultPath, graphCache)
    console.log(`[guru] Changed: ${path.relative(vaultPath, filePath)}`)
    wss.clients.forEach(c => c.readyState === 1 && c.send(JSON.stringify({ type: 'refresh', data: graphCache })))
  },
  onRemove: filePath => {
    graphCache = removeNote(filePath, vaultPath, graphCache)
    console.log(`[guru] Removed: ${path.relative(vaultPath, filePath)}`)
    wss.clients.forEach(c => c.readyState === 1 && c.send(JSON.stringify({ type: 'refresh', data: graphCache })))
  },
})

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const PORT = 3001
server.listen(PORT, () => {
  console.log(`[guru] Server running at http://localhost:${PORT}`)
  console.log(`[guru] Project root: ${projectRoot}`)
  console.log(`[guru] Vault: ${vaultPath}`)
  if (stagingPath) console.log(`[guru] Staging: ${stagingPath}`)
})
