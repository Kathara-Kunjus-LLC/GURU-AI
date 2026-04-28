import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { renderMarkdown } from '../lib/markdown'
import { domainColor } from '../lib/colors'

function Tag({ children, style }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={style}
    >
      {children}
    </span>
  )
}

function MetadataRow({ note }) {
  const color = domainColor(note.parentDomain)
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-5">
      <Tag style={{ backgroundColor: color + '18', color, border: `1px solid ${color}35` }}>
        {note.parentDomain}
      </Tag>
      <Tag style={{ backgroundColor: 'rgba(30,41,59,0.6)', color: '#64748b', border: '1px solid rgba(51,65,85,0.4)' }}>
        {note.domain}
      </Tag>
      {note.isBridge && (
        <Tag style={{ backgroundColor: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
          ◇ bridge
        </Tag>
      )}
    </div>
  )
}

function BacklinksSection({ noteId, edges, nodes }) {
  const navigate = useNavigate()
  const backlinks = edges
    .filter(e => e.target === noteId)
    .map(e => ({ ...nodes.find(n => n.id === e.source), edgeType: e.type }))
    .filter(Boolean)

  if (backlinks.length === 0) return null

  return (
    <div className="mt-8 pt-5 border-t border-slate-800/60">
      <p className="text-[10px] font-semibold tracking-widest text-slate-600 uppercase mb-3">
        Linked from
      </p>
      <ul className="space-y-1">
        {backlinks.map(n => (
          <li key={n.id + n.edgeType}>
            <button
              onClick={() => navigate(`/note/${encodeURIComponent(n.id)}`)}
              className="text-sm text-indigo-400/80 hover:text-indigo-300 text-left transition-colors"
            >
              {n.title}
              <span className="text-slate-600 text-xs ml-1.5">({n.edgeType})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function NotePanel({ note, edges, nodes, onClose, loading, error }) {
  const navigate = useNavigate()
  const [html, setHtml] = useState('')
  const contentRef = useRef(null)

  useEffect(() => {
    if (!note?.content) { setHtml(''); return }
    renderMarkdown(note.content).then(setHtml).catch(() => setHtml('<p>Render error</p>'))
  }, [note?.content])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const handler = (e) => {
      const link = e.target.closest('.wikilink')
      if (!link) return
      e.preventDefault()
      const target = link.dataset.target
      if (target) navigate(`/note/${encodeURIComponent(target)}`)
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [html, navigate])

  const isOpen = !!(note || loading || error)

  return (
    <div
      className={`fixed right-0 top-0 h-full w-[22rem] bg-slate-950 border-l border-slate-800/60 flex flex-col
        transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-800/60 shrink-0">
        <h2 className="text-slate-100 font-semibold text-sm leading-snug pr-4 line-clamp-2">
          {note?.title ?? (loading ? '…' : '')}
        </h2>
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 text-slate-600 hover:text-slate-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {error && (
          <div className="text-red-400/80 text-xs bg-red-900/15 border border-red-900/30 rounded-lg p-3">
            {error}
          </div>
        )}

        {loading && !error && (
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
            Loading…
          </div>
        )}

        {note && !loading && (
          <>
            <MetadataRow note={note} />

            {note.source && (
              <p className="text-[11px] text-slate-600 mb-5 -mt-2">
                {note.source}
              </p>
            )}

            <div
              ref={contentRef}
              className="note-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <BacklinksSection noteId={note.id} edges={edges} nodes={nodes} />
          </>
        )}
      </div>
    </div>
  )
}
