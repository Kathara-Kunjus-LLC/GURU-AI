import { useMemo } from 'react'
import { PARENT_DOMAIN_COLORS } from '../lib/colors'

const EDGE_TYPES = ['prereq', 'builds-into', 'related']

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest text-slate-600 uppercase mb-2">
      {children}
    </p>
  )
}

function Divider() {
  return <div className="border-t border-slate-800/70" />
}

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
    <aside className="w-56 shrink-0 bg-slate-950 border-r border-slate-800/60 flex flex-col overflow-y-auto">
      <div className="flex flex-col gap-5 p-4 pt-5">

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search…"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-slate-900 transition-colors"
          />
        </div>

        <Divider />

        {/* Domains */}
        <div>
          <SectionLabel>Domains</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {parentDomains.map(domain => {
              const color = PARENT_DOMAIN_COLORS[domain.toLowerCase()] ?? '#94a3b8'
              const hidden = filters.hiddenDomains.has(domain)
              return (
                <button
                  key={domain}
                  onClick={() => toggleDomain(domain)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium transition-all duration-150"
                  style={{
                    backgroundColor: hidden ? 'transparent' : color + '18',
                    color: hidden ? '#334155' : color,
                    border: `1px solid ${hidden ? '#1e293b' : color + '40'}`,
                  }}
                >
                  {domain}
                </button>
              )
            })}
          </div>
        </div>

        <Divider />

        {/* Edge types */}
        <div>
          <SectionLabel>Edge types</SectionLabel>
          <div className="flex flex-col gap-1">
            {EDGE_TYPES.map(type => {
              const active = !filters.hiddenEdgeTypes.has(type)
              return (
                <button
                  key={type}
                  onClick={() => toggleEdgeType(type)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                    active ? 'bg-slate-800/80 text-slate-300' : 'text-slate-700 hover:text-slate-600'
                  }`}
                >
                  <span className="capitalize">{type}</span>
                  <span className={`text-[10px] ${active ? 'text-slate-500' : 'text-slate-800'}`}>
                    {type === 'prereq' ? '——' : type === 'builds-into' ? '╌╌' : '···'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <Divider />

        {/* Bridge filter */}
        <button
          onClick={() => onFiltersChange({ ...filters, bridgeOnly: !filters.bridgeOnly })}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 ${
            filters.bridgeOnly
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
              : 'text-slate-600 hover:text-slate-500 border border-transparent'
          }`}
        >
          <span className="text-base leading-none">◇</span>
          <span>Bridge concepts only</span>
        </button>

        <Divider />

        {/* Show staged */}
        <button
          onClick={() => onFiltersChange({ ...filters, showStaged: !filters.showStaged })}
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-150 ${
            filters.showStaged
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
              : 'text-slate-600 hover:text-slate-500 border border-transparent'
          }`}
        >
          <span className="text-base leading-none">◌</span>
          <span>Show staged notes</span>
        </button>

        <Divider />

        {/* Depth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <SectionLabel>Depth</SectionLabel>
            <span className="text-xs text-slate-400 font-medium -mt-2">
              {filters.depth === 0 ? 'all' : filters.depth}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            value={filters.depth}
            onChange={e => onFiltersChange({ ...filters, depth: Number(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-700 mt-0.5">
            <span>all</span>
            <span>5 hops</span>
          </div>
        </div>

      </div>
    </aside>
  )
}
