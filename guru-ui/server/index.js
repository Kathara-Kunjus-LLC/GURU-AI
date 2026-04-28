import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import { parseVault, addOrUpdateNote, removeNote } from './parser.js'
import { setupWatcher } from './watcher.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
const vaultPath = config.vault_path
const stagingPath = config.staging_path

if (!vaultPath) {
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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

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
// Routes
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
// WebSocket + watcher
// ---------------------------------------------------------------------------

const server = createServer(app)
const wss = new WebSocketServer({ server })

function broadcast() {
  wss.clients.forEach(client => {
    if (client.readyState === 1 /* OPEN */) {
      client.send(JSON.stringify({ type: 'refresh', data: graphCache }))
    }
  })
}

setupWatcher(vaultPath, {
  onAdd: filePath => {
    graphCache = addOrUpdateNote(filePath, vaultPath, graphCache)
    console.log(`[guru] Added: ${path.relative(vaultPath, filePath)}`)
    broadcast()
  },
  onChange: filePath => {
    graphCache = addOrUpdateNote(filePath, vaultPath, graphCache)
    console.log(`[guru] Changed: ${path.relative(vaultPath, filePath)}`)
    broadcast()
  },
  onRemove: filePath => {
    graphCache = removeNote(filePath, vaultPath, graphCache)
    console.log(`[guru] Removed: ${path.relative(vaultPath, filePath)}`)
    broadcast()
  },
})

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const PORT = 3001
server.listen(PORT, () => {
  console.log(`[guru] Server running at http://localhost:${PORT}`)
  console.log(`[guru] Vault: ${vaultPath}`)
  if (stagingPath) console.log(`[guru] Staging: ${stagingPath} (toggle with ?include=staging)`)
})
