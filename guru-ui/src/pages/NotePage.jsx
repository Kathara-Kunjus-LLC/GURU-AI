import { useEffect, useState, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppShell'
import { useVault } from '../hooks/useVault'
import { useNote } from '../hooks/useNote'
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
    <div className="flex flex-wrap items-center gap-1.5 mb-6">
      {note.parentDomain && (
        <Tag style={{ backgroundColor: color + '18', color, border: `1px solid ${color}35` }}>
          {note.parentDomain}
        </Tag>
      )}
      {note.domain && (
        <Tag style={{ backgroundColor: 'rgba(30,41,59,0.6)', color: '#64748b', border: '1px solid rgba(51,65,85,0.4)' }}>
          {note.domain}
        </Tag>
      )}
      {note.isBridge && (
        <Tag style={{ backgroundColor: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
          ◇ bridge
        </Tag>
      )}
      {note.isStaged && (
        <Tag style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
          ◌ staged
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
    .filter(n => n.id)

  if (backlinks.length === 0) return null

  return (
    <div className="mt-10 pt-6 border-t border-slate-800/60">
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

export default function NotePage() {
  const { title: routeTitle } = useParams()
  const navigate = useNavigate()
  const title = routeTitle ? decodeURIComponent(routeTitle) : null

  const { data: vaultData } = useVault({ includeStaging: true })
  const { data: note, loading, error } = useNote(title)

  const nodes = vaultData?.nodes ?? []
  const edges = vaultData?.edges ?? []

  const [html, setHtml] = useState('')
  const contentRef = useRef(null)

  useEffect(() => {
    document.title = title ? `${title} — Guru` : 'Guru'
  }, [title])

  useEffect(() => {
    if (!note?.content) { setHtml(''); return }
    renderMarkdown(note.content).then(setHtml).catch(() => setHtml('<p>Render error</p>'))
  }, [note?.content])

  // Wikilink clicks navigate to the target note page
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

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      <AppHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            back to graph
          </button>

          {loading && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Loading…
            </div>
          )}

          {error && !loading && (
            <div className="text-red-400/80 text-sm bg-red-900/15 border border-red-900/30 rounded-lg p-4">
              Could not load note: {error}
              <div className="mt-2">
                <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-xs">Return to graph</Link>
              </div>
            </div>
          )}

          {note && !loading && (
            <>
              <h1 className="text-slate-100 text-2xl font-semibold tracking-tight mb-4">{note.title}</h1>
              <MetadataRow note={note} />

              {note.source && (
                <p className="text-[11px] text-slate-600 mb-6 -mt-3">
                  {Array.isArray(note.source) ? note.source.join(' · ') : note.source}
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
    </div>
  )
}
