const chokidar = require('chokidar')

function setupWatcher(vaultPath, onChange) {
  const watcher = chokidar.watch(vaultPath, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true,
  })

  let debounce
  const trigger = () => {
    clearTimeout(debounce)
    debounce = setTimeout(onChange, 400)
  }

  watcher.on('add', trigger).on('change', trigger).on('unlink', trigger)
}

module.exports = { setupWatcher }
