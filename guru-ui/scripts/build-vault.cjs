const fs = require('fs')
const path = require('path')
const { parseVault } = require('../server/parser.cjs')

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

const outPath = path.join(__dirname, '..', 'public', 'vault.json')
fs.writeFileSync(outPath, JSON.stringify({ nodes, edges }, null, 2))

const bridges = nodes.filter(n => n.isBridge).length
console.log(`[build-vault] Done — ${nodes.length} notes, ${edges.length} edges, ${bridges} bridge concepts`)
console.log(`[build-vault] Written to ${outPath}`)
