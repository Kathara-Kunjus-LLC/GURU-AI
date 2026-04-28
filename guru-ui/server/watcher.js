import chokidar from 'chokidar'

export function setupWatcher(vaultPath, { onAdd, onChange, onRemove }) {
  const watcher = chokidar.watch(vaultPath, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true,
  })

  const debounces = new Map()

  function debounced(key, fn) {
    clearTimeout(debounces.get(key))
    debounces.set(key, setTimeout(() => {
      debounces.delete(key)
      fn()
    }, 400))
  }

  watcher
    .on('add',    filePath => debounced(filePath, () => onAdd(filePath)))
    .on('change', filePath => debounced(filePath, () => onChange(filePath)))
    .on('unlink', filePath => debounced(filePath, () => onRemove(filePath)))
}
