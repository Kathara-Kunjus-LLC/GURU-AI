import { useMemo } from 'react'
import { PARENT_DOMAIN_COLORS } from '../lib/colors'

const EDGE_TYPES = ['prereq', 'builds-into', 'related']

export default function FilterBar({ nodes, filters, onFiltersChange }) {
  const parentDomains = useMemo(() => {
    const seen = new Set()
    nodes.forEach(n => { if (n.parentDomain) seen.add(n.parentDomain) })
    return [...seen].sort()
  }, [nodes])

  function toggleDomain(domain) {
    const next = new Set(filters.hiddenDomains)
    next.has(domain) ? next.delete(domain) : next.add(domain)
    onFiltersChange({ ...filters, hiddenDomains: next })
  }

  function toggleEdgeType(type) {
    const next = new Set(filters.hiddenEdgeTypes)
    next.has(type) ? next.delete(type) : next.add(type)
    onFiltersChange({ ...filters, hiddenEdgeTypes: next })
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col gap-4 p-4 overflow-y-auto">
      <h2 className="text-slate-200 font-semibold text-sm tracking-wide uppercase">Filters</h2>

      {/* Search */}
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="Fuzzy search titles…"
          className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Parent-domain pills */}
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Domains</label>
        <div className="flex flex-wrap gap-1.5">
          {parentDomains.map(domain => {
            const color = PARENT_DOMAIN_COLORS[domain.toLowerCase()] ?? '#94a3b8'
            const hidden = filters.hiddenDomains.has(domain)
            return (
              <button
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-opacity ${hidden ? 'opacity-30' : 'opacity-100'}`}
                style={{ backgroundColor: color + '33', color, border: `1px solid ${color}66` }}
              >
                {domain}
              </button>
            )
          })}
        </div>
      </div>

      {/* Edge type toggles */}
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Edge types</label>
        <div className="flex flex-col gap-1">
          {EDGE_TYPES.map(type => {
            const hidden = filters.hiddenEdgeTypes.has(type)
            return (
              <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!hidden}
                  onChange={() => toggleEdgeType(type)}
                  className="accent-indigo-500"
                />
                <span className="text-sm text-slate-300 capitalize">{type}</span>
                <span className="ml-auto text-xs text-slate-500">
                  {type === 'prereq' ? '——' : type === 'builds-into' ? '- -' : '···'}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Bridge filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.bridgeOnly}
            onChange={e => onFiltersChange({ ...filters, bridgeOnly: e.target.checked })}
            className="accent-indigo-500"
          />
          <span className="text-sm text-slate-300">Bridge concepts only</span>
        </label>
        <p className="text-xs text-slate-500 mt-1 ml-5">Dims non-bridge nodes</p>
      </div>

      {/* Depth slider */}
      <div>
        <label className="text-xs text-slate-400 mb-1 block">
          Depth from selected: <span className="text-slate-200 font-medium">{filters.depth === 0 ? 'all' : filters.depth}</span>
        </label>
        <input
          type="range"
          min={0}
          max={5}
          value={filters.depth}
          onChange={e => onFiltersChange({ ...filters, depth: Number(e.target.value) })}
          className="w-full accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-0.5">
          <span>all</span>
          <span>5</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-auto pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 mb-2">Node shape</p>
        <div className="flex flex-col gap-1 text-xs text-slate-400">
          <span>○ concept</span>
          <span>◇ bridge concept</span>
        </div>
      </div>
    </aside>
  )
}
