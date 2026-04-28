import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { renderMarkdown } from '../lib/markdown'
import { domainColor } from '../lib/colors'

function MetadataCard({ note }) {
  const color = domainColor(note.parentDomain)
  return (
    <div className="border border-slate-700 rounded-lg p-3 mb-4 bg-slate-800/50">
      <div className="flex items-start gap-2 mb-2">
        <span
          className="mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
        >
          {note.parentDomain}
        </span>
        {note.isBridge && (
          <span className="mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-700/40">
            ◇ bridge
          </span>
        )}
      </div>
      <div className="text-xs text-slate-400 space-y-1">
        <div><span className="text-slate-500">domain</span> · {note.domain}</div>
        {note.source && <div><span className="text-slate-500">source</span> · {note.source}</div>}
      </div>
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
    <div className="mt-6 pt-4 border-t border-slate-700">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Linked from
      </h3>
      <ul className="space-y-1">
        {backlinks.map(n => (
          <li key={n.id + n.edgeType}>
            <button
              onClick={() => navigate(`/note/${encodeURIComponent(n.id)}`)}
              className="text-sm text-indigo-400 hover:text-indigo-300 text-left"
            >
              {n.title}
              <span className="text-slate-500 text-xs ml-1">({n.edgeType})</span>
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

  // Wire up wikilink clicks inside the rendered markdown
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
      className={`fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 flex flex-col
        transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
        <h2 className="text-slate-200 font-semibold text-sm truncate pr-4">
          {note?.title ?? (loading ? 'Loading…' : 'Note')}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 text-lg leading-none shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-3">
            {error}
          </div>
        )}

        {loading && !error && (
          <div className="text-slate-500 text-sm">Loading…</div>
        )}

        {note && !loading && (
          <>
            <MetadataCard note={note} />

            <div
              ref={contentRef}
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-slate-200 prose-headings:font-semibold
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                prose-code:text-emerald-300 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700
                [&_.wikilink]:text-indigo-400 [&_.wikilink]:cursor-pointer hover:[&_.wikilink]:underline"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <BacklinksSection noteId={note.id} edges={edges} nodes={nodes} />
          </>
        )}
      </div>
    </div>
  )
}
