import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parseVault } from '../server/parser.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const configPath = path.join(__dirname, '..', 'config.json')
if (!fs.existsSync(configPath)) {
  console.error('[build-vault] config.json not found. Run: ln -sf ../config.json config.json')
  process.exit(1)
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const vaultPath = config.vault_path

if (!vaultPath) {
  console.error('[build-vault] config.json is missing "vault_path"')
  process.exit(1)
}

try {
  fs.accessSync(vaultPath)
} catch {
  console.error(`[build-vault] vault_path not found: ${vaultPath}`)
  process.exit(1)
}

console.log(`[build-vault] Parsing vault at ${vaultPath}...`)
const { nodes, edges } = parseVault(vaultPath)

const publicDir = path.join(__dirname, '..', 'public')
const notesDir = path.join(publicDir, 'notes')
fs.mkdirSync(notesDir, { recursive: true })

// graph.json — metadata only, no content field
const graphNodes = nodes.map(({ content: _content, ...rest }) => rest)
const graphData = { nodes: graphNodes, edges }
fs.writeFileSync(path.join(publicDir, 'graph.json'), JSON.stringify(graphData, null, 2))

// public/notes/{encodedTitle}.json — full content per note
let skipped = 0
for (const node of nodes) {
  try {
    const filename = encodeURIComponent(node.id) + '.json'
    fs.writeFileSync(path.join(notesDir, filename), JSON.stringify(node, null, 2))
  } catch (err) {
    console.warn(`[WARN] Skipped note file for "${node.id}": ${err.message}`)
    skipped++
  }
}

const bridges = nodes.filter(n => n.isBridge).length
console.log(`[build-vault] Done — ${nodes.length} notes, ${edges.length} edges, ${bridges} bridge concepts`)
console.log(`[build-vault] Written: public/graph.json, public/notes/ (${nodes.length - skipped} files)`)
if (skipped > 0) console.warn(`[build-vault] Skipped: ${skipped} note file(s) — see warnings above`)
