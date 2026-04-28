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
  hiddenEdgeTypes: new Set(['related']),   // related hidden by default
  bridgeOnly: false,
  depth: 0,
}

export default function App() {
  const navigate = useNavigate()
  const { title: routeTitle } = useParams()

  const { data: vaultData, loading: vaultLoading, error: vaultError, connected } = useVault()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const selectedTitle = routeTitle ? decodeURIComponent(routeTitle) : null
  const { data: noteData, loading: noteLoading, error: noteError } = useNote(selectedTitle, vaultData)

  const nodes = vaultData?.nodes ?? []
  const edges = vaultData?.edges ?? []

  // Fuse instance for fuzzy search
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

  // Page title
  useEffect(() => {
    document.title = selectedTitle ? `${selectedTitle} — Guru` : 'Guru — Knowledge Graph'
  }, [selectedTitle])

  if (vaultLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading vault…
      </div>
    )
  }

  if (vaultError) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-400 font-medium mb-2">Could not load vault</p>
          <p className="text-slate-400 text-sm">{vaultError}</p>
          <p className="text-slate-500 text-xs mt-3">
            Make sure the Express server is running: <code className="text-slate-300">npm run dev</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Disconnected banner */}
      {!connected && (
        <div className="bg-amber-900/70 border-b border-amber-700 text-amber-200 text-xs text-center py-1.5 px-4">
          Disconnected — reconnecting to server…
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate('/')} className="text-slate-200 font-bold tracking-tight">
          Guru
        </button>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400 text-sm">{nodes.length} notes</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400 text-sm">{edges.length} connections</span>
        <span className="ml-auto text-slate-400 text-sm">
          {nodes.filter(n => n.isBridge).length} bridge concepts
        </span>
      </header>

      {/* Main */}
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
