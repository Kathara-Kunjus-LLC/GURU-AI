import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useVault } from './hooks/useVault'
import { useNote } from './hooks/useNote'
import Graph from './components/Graph'
import FilterBar from './components/FilterBar'
import NotePanel from './components/NotePanel'

const DEFAULT_FILTERS = {
  search: '',
  hiddenDomains: new Set(),
  hiddenEdgeTypes: new Set(['related']),
  bridgeOnly: false,
  showStaged: false,
  depth: 0,
}

export default function App() {
  const navigate = useNavigate()
  const { title: routeTitle } = useParams()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const { data: vaultData, loading: vaultLoading, error: vaultError, connected } = useVault({
    includeStaging: filters.showStaged,
  })

  const selectedTitle = routeTitle ? decodeURIComponent(routeTitle) : null
  const { data: noteData, loading: noteLoading, error: noteError } = useNote(selectedTitle)

  const nodes = vaultData?.nodes ?? []
  const edges = vaultData?.edges ?? []

  const fuse = useMemo(
    () => new Fuse(nodes, { keys: ['title'], threshold: 0.3 }),
    [nodes]
  )

  const searchMatches = useMemo(() => {
    if (!filters.search) return null
    const results = fuse.search(filters.search)
    return new Set(results.map(r => r.item.id))
  }, [filters.search, fuse])

  function handleSelectNode(id) {
    if (!id) {
      navigate('/')
    } else {
      navigate(`/note/${encodeURIComponent(id)}`)
    }
  }

  function handleClosePanel() {
    navigate('/')
  }

  useEffect(() => {
    document.title = selectedTitle ? `${selectedTitle} — Guru` : 'Guru — Knowledge Graph'
  }, [selectedTitle])

  if (vaultLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Loading vault…
        </div>
      </div>
    )
  }

  if (vaultError) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-sm px-6 py-8 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-slate-200 font-medium mb-1">Could not load vault</p>
          <p className="text-slate-500 text-sm mb-4">{vaultError}</p>
          <code className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">npm run dev</code>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {!connected && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-xs text-center py-1.5 px-4 tracking-wide">
          Reconnecting to server…
        </div>
      )}

      <header className="bg-slate-950 border-b border-slate-800/60 px-5 py-3 flex items-center shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-slate-100 font-semibold tracking-tight text-base mr-auto"
        >
          guru
        </button>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>{nodes.filter(n => !n.isStaged).length} notes</span>
          {nodes.some(n => n.isStaged) && (
            <span className="text-amber-500/70">{nodes.filter(n => n.isStaged).length} staged</span>
          )}
          <span>{edges.length} edges</span>
          <span className="text-indigo-500/70">{nodes.filter(n => n.isBridge).length} bridges</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <FilterBar
          nodes={nodes}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <Graph
          nodes={nodes}
          edges={edges}
          filters={filters}
          selectedId={selectedTitle}
          onSelectNode={handleSelectNode}
          searchMatches={searchMatches}
        />

        <NotePanel
          note={noteData}
          edges={edges}
          nodes={nodes}
          onClose={handleClosePanel}
          loading={noteLoading}
          error={noteError}
        />
      </div>
    </div>
  )
}
