import { useMemo, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useJobs } from '../hooks/useJobs'

const STATUS_STYLES = {
  queued:    { dot: 'bg-slate-500',                label: 'queued',     text: 'text-slate-500' },
  running:   { dot: 'bg-indigo-400 animate-pulse', label: 'running',    text: 'text-indigo-400' },
  completed: { dot: 'bg-emerald-500',              label: 'completed',  text: 'text-emerald-400' },
  failed:    { dot: 'bg-red-500',                  label: 'failed',     text: 'text-red-400' },
  paused:    { dot: 'bg-amber-500',                label: 'paused',     text: 'text-amber-400' },
}

function bookAggStatus(chapters) {
  if (chapters.some(c => c.status === 'running')) return 'running'
  if (chapters.some(c => c.status === 'paused'))  return 'paused'
  if (chapters.some(c => c.status === 'failed'))  return 'failed'
  if (chapters.some(c => c.status === 'queued'))  return 'queued'
  return 'completed'
}

function bookStatLine(chapters) {
  const counts = {}
  for (const c of chapters) counts[c.status] = (counts[c.status] || 0) + 1
  return ['running', 'paused', 'failed', 'queued', 'completed']
    .filter(s => counts[s])
    .map(s => `${counts[s]} ${s}`)
    .join(' · ')
}

function duration(job) {
  if (!job.startedAt) return null
  const end = job.completedAt ? new Date(job.completedAt) : new Date()
  const ms = end - new Date(job.startedAt)
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso)
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

export default function QueuePage() {
  const navigate = useNavigate()
  const { jobs, loading, deleteJob, clearJobs } = useJobs()
  const [expanded, setExpanded] = useState(new Set())
  const [clearing, setClearing] = useState(false)

  const hasInactive = jobs.some(j => ['completed', 'failed', 'paused'].includes(j.status))

  async function handleClear() {
    setClearing(true)
    try { await clearJobs() } catch {}
    setClearing(false)
  }

  const grouped = useMemo(() => {
    const map = new Map()
    for (const job of [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))) {
      const key = job.bookTitle || job.bookSlug
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(job)
    }
    return [...map.entries()]
  }, [jobs])

  // Auto-expand books with active jobs on first load
  useEffect(() => {
    const active = grouped
      .filter(([, chs]) => chs.some(c => c.status === 'running' || c.status === 'paused'))
      .map(([title]) => title)
    if (active.length > 0) setExpanded(prev => new Set([...prev, ...active]))
  }, [grouped.length])

  function toggle(bookTitle) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(bookTitle) ? next.delete(bookTitle) : next.add(bookTitle)
      return next
    })
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </AppShell>
    )
  }

  if (jobs.length === 0) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-slate-300 font-medium mb-2">No jobs yet</p>
          <p className="text-slate-600 text-sm mb-6">Drop a PDF to start generating notes.</p>
          <Link to="/ingest" className="inline-block px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
            Ingest PDF
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-slate-100 text-lg font-semibold">Processing Queue</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {grouped.length} book{grouped.length !== 1 ? 's' : ''} · {jobs.length} chapter{jobs.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasInactive && (
              <button
                onClick={handleClear}
                disabled={clearing}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-300 text-xs transition-colors disabled:opacity-40"
              >
                {clearing ? 'Clearing…' : 'Clear completed'}
              </button>
            )}
            <Link to="/ingest" className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors">
              + Ingest PDF
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {grouped.map(([bookTitle, bookJobs]) => {
            const aggStatus = bookAggStatus(bookJobs)
            const s = STATUS_STYLES[aggStatus] || STATUS_STYLES.queued
            const isOpen = expanded.has(bookTitle)

            return (
              <div key={bookTitle} className="rounded-xl border border-slate-800 overflow-hidden">
                {/* Book row — click to expand */}
                <button
                  onClick={() => toggle(bookTitle)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-slate-900/40 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-slate-100 text-sm font-medium">{bookTitle}</span>
                      <span className="text-xs text-slate-600 bg-slate-800/80 px-2 py-0.5 rounded-full">
                        {bookJobs.length} chapter{bookJobs.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{bookStatLine(bookJobs)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                    <span className="text-slate-600 text-xs select-none">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Chapter list — visible when expanded */}
                {isOpen && (
                  <div className="border-t border-slate-800">
                    {bookJobs.map(job => {
                      const cs = STATUS_STYLES[job.status] || STATUS_STYLES.queued
                      const dur = duration(job)
                      return (
                        <div
                          key={job.id}
                          className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-slate-900/50 border-b border-slate-800/50 last:border-b-0 transition-colors group"
                        >
                          <button className="contents" onClick={() => navigate(`/queue/${job.id}`)}>
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ml-0.5 ${cs.dot}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-300 text-sm truncate">
                                Ch. {job.chapter} — {job.chapterTitle}
                              </p>
                              {job.status === 'running' && job.progress?.total > 0 && (
                                <div className="mt-1.5 h-0.5 rounded-full bg-slate-800 overflow-hidden w-40">
                                  <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.round((job.progress.done / job.progress.total) * 100)}%` }}
                                  />
                                </div>
                              )}
                              {(job.status === 'failed' || job.status === 'paused') && job.error && (
                                <p className="text-red-400/60 text-xs mt-0.5 truncate">{job.error}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0 text-xs">
                              {dur && <span className="text-slate-700">{dur}</span>}
                              <span className="text-slate-700">{timeAgo(job.createdAt)}</span>
                              <span className={`font-medium ${cs.text}`}>{cs.label}</span>
                              <span className="text-slate-700">→</span>
                            </div>
                          </button>
                          {job.status !== 'running' && job.status !== 'queued' && (
                            <button
                              onClick={e => { e.stopPropagation(); deleteJob(job.id) }}
                              className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-700 hover:text-red-400 text-sm transition-all px-1"
                              title="Delete job"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
