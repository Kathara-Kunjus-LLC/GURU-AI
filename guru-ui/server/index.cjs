const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const { parseVault } = require('./parser.cjs')
const { setupWatcher } = require('./watcher.cjs')

// Load config
const configPath = path.join(__dirname, '..', 'config.json')
if (!fs.existsSync(configPath)) {
  console.error(`[guru] config.json not found at ${configPath}`)
  console.error('[guru] Run: ln -sf ../config.json config.json  (from guru-ui/)')
  process.exit(1)
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const vaultPath = config.vault_path

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

const app = express()
app.use(morgan('dev'))

// Allow Vite dev server to reach the API
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

app.get('/api/graph', (req, res) => {
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

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

setupWatcher(vaultPath, () => {
  refresh()
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'refresh', data: graphCache }))
    }
  })
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`[guru] Server running at http://localhost:${PORT}`)
  console.log(`[guru] Vault: ${vaultPath}`)
})
