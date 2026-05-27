import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useJobStream } from '../hooks/useJobStream'

const STATUS_STYLES = {
  queued:    { label: 'queued',     cls: 'text-slate-400 bg-slate-800' },
  running:   { label: 'running',    cls: 'text-indigo-300 bg-indigo-900/40' },
  completed: { label: 'completed',  cls: 'text-emerald-300 bg-emerald-900/30' },
  failed:    { label: 'failed',     cls: 'text-red-300 bg-red-900/30' },
  paused:    { label: 'paused',     cls: 'text-amber-300 bg-amber-900/30' },
}

const STEP_LABELS = {
  chunk:   'Chunking text…',
  process: 'Calling Claude…',
}

const LOG_COLORS = {
  info:  'text-slate-300',
  warn:  'text-amber-400',
  error: 'text-red-400',
}

function fmt(n) {
  if (!n) return '—'
  return n.toLocaleString()
}

function useCountdown(isoTarget) {
  const [ms, setMs] = useState(null)
  useEffect(() => {
    if (!isoTarget) return
    const tick = () => setMs(Math.max(0, new Date(isoTarget) - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isoTarget])
  return ms
}

function fmtCountdown(ms) {
  if (ms == null) return null
  if (ms <= 0) return 'now'
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ${s % 60}s`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

function ProviderCard({ name, provider }) {
  if (!provider) return null
  const { status, reset_at } = provider
  const colors = {
    available:   { border: 'border-emerald-800/30', bg: 'bg-emerald-900/20', label: 'text-emerald-300', sub: 'text-emerald-600' },
    rate_limited:{ border: 'border-amber-800/30',   bg: 'bg-amber-900/20',   label: 'text-amber-300',   sub: 'text-amber-600' },
    no_credits:  { border: 'border-red-800/30',     bg: 'bg-red-900/20',     label: 'text-red-300',     sub: 'text-red-600' },
    unavailable: { border: 'border-slate-800',      bg: 'bg-slate-900/40',   label: 'text-slate-500',   sub: 'text-slate-700' },
  }
  const c = colors[status] || colors.unavailable
  const statusLabel = {
    available:   'Available',
    rate_limited:'Rate limited',
    no_credits:  'No credits',
    unavailable: 'Not installed',
  }
  return (
    <div className={`rounded-lg p-3 text-xs border ${c.border} ${c.bg}`}>
      <p className={`font-medium mb-1 ${c.label}`}>{name}</p>
      <p className={c.sub}>{statusLabel[status] || status}</p>
      {status === 'rate_limited' && reset_at && (
        <p className="text-amber-700 mt-1">
          Resets ~{new Date(reset_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
      {status === 'no_credits' && (
        <p className="text-red-700 mt-1">Add credits at console.anthropic.com</p>
      )}
    </div>
  )
}

export default function JobDetailPage() {
  const { jobId } = useParams()
  const [initialJob, setInitialJob] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [resuming, setResuming] = useState(false)
  const [resumeKey, setResumeKey] = useState(0)
  const logRef = useRef()

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setInitialJob)
      .catch(() => setLoadError('Job not found'))
  }, [jobId])

  const { logs, progress, status, summary, pauseInfo } = useJobStream(jobId, initialJob, resumeKey)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logs.length])

  const resumeAt = pauseInfo?.resumeAt || null
  const countdown = useCountdown(resumeAt)
  const canResume = !resumeAt || (countdown != null && countdown <= 0)

  async function handleResume() {
    setResuming(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/resume`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const updatedJob = await res.json()
      setInitialJob(updatedJob)        // seed state with reset job
      setResumeKey(k => k + 1)        // reconnect SSE
    } catch {
      // ignore
    } finally {
      setResuming(false)
    }
  }

  if (loadError) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-slate-400">{loadError}</p>
          <Link to="/queue" className="text-indigo-400 text-sm mt-3 inline-block hover:underline">← Back to queue</Link>
        </div>
      </AppShell>
    )
  }

  if (!initialJob) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
      </AppShell>
    )
  }

  const currentStatus = status || initialJob.status
  const s = STATUS_STYLES[currentStatus] || STATUS_STYLES.queued
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to="/queue" className="text-slate-600 hover:text-slate-400 text-xs mb-2 inline-block">← Queue</Link>
            <h1 className="text-slate-100 font-semibold text-base">{initialJob.bookTitle}</h1>
            <p className="text-slate-500 text-sm">Ch. {initialJob.chapter} — {initialJob.chapterTitle}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>
        </div>

        {/* Progress bar */}
        {(currentStatus === 'running' || currentStatus === 'queued') && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span>{initialJob.currentStep ? STEP_LABELS[initialJob.currentStep] || initialJob.currentStep : 'Waiting in queue…'}</span>
              {progress.total > 0 && (
                <span className="text-slate-400">{progress.done}/{progress.total} chunks</span>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            {currentStatus === 'running' && (
              <p className="text-slate-600 text-xs mt-2">{pct}% complete</p>
            )}
          </div>
        )}

        {/* Paused — rate limit */}
        {currentStatus === 'paused' && (
          <div className="rounded-xl bg-amber-950/30 border border-amber-800/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-amber-300 text-sm font-medium">Paused — rate limit reached</p>
              {progress.total > 0 && (
                <span className="text-amber-600 text-xs">{progress.done}/{progress.total} chunks done</span>
              )}
            </div>

            <p className="text-amber-600/80 text-xs">
              Both providers hit their rate limits. Progress is saved — resuming will continue from chunk {progress.done + 1}.
            </p>

            {pauseInfo?.providers && (
              <div className="grid grid-cols-2 gap-3">
                <ProviderCard name="Anthropic API" provider={pauseInfo.providers.api} />
                <ProviderCard name="Claude Code Pro" provider={pauseInfo.providers.claude_code} />
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleResume}
                disabled={resuming || !canResume}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {resuming ? 'Resuming…' : 'Resume'}
              </button>
              {!canResume && countdown != null && (
                <span className="text-amber-600 text-xs">
                  Available in {fmtCountdown(countdown)}
                </span>
              )}
              {canResume && resumeAt && (
                <span className="text-amber-500 text-xs">Tokens refreshed — ready to resume</span>
              )}
            </div>
          </div>
        )}

        {/* Summary card — shown on completion */}
        {currentStatus === 'completed' && summary && (
          <div className="rounded-xl bg-emerald-950/30 border border-emerald-800/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-emerald-300 text-sm font-medium">Completed</p>
              {summary.noteCount != null && (
                <span className="text-emerald-400 text-xs">{summary.noteCount} notes generated</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 rounded-lg p-3">
                <p className="text-slate-500 mb-1">Input tokens</p>
                <p className="text-slate-200 font-mono">{fmt(summary.inputTokens)}</p>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3">
                <p className="text-slate-500 mb-1">Output tokens</p>
                <p className="text-slate-200 font-mono">{fmt(summary.outputTokens)}</p>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3">
                <p className="text-slate-500 mb-1">Cache creation</p>
                <p className="text-slate-200 font-mono">{fmt(summary.cacheCreation)}</p>
              </div>
              <div className="bg-emerald-900/30 rounded-lg p-3">
                <p className="text-emerald-600 mb-1">Cache reads (90% off)</p>
                <p className="text-emerald-300 font-mono">{fmt(summary.cacheReads)}</p>
              </div>
            </div>

            {summary.bridges?.length > 0 && (
              <div>
                <p className="text-slate-500 text-xs mb-2">Bridge concepts identified</p>
                <div className="flex flex-wrap gap-1.5">
                  {summary.bridges.map((b, i) => (
                    <span key={i} className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/review"
              className="inline-block mt-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Review staged notes →
            </Link>
          </div>
        )}

        {/* Failed */}
        {currentStatus === 'failed' && (
          <div className="rounded-xl bg-red-950/30 border border-red-800/40 p-5 space-y-3">
            <p className="text-red-300 text-sm font-medium">Job failed</p>
            <p className="text-red-400/70 text-xs">{initialJob.error || 'Check logs below for details.'}</p>
            <button
              onClick={handleResume}
              disabled={resuming}
              className="px-4 py-2 rounded-lg border border-red-800/40 text-red-400 hover:text-red-300 text-sm transition-colors disabled:opacity-40"
            >
              {resuming ? 'Retrying…' : 'Retry from last checkpoint'}
            </button>
          </div>
        )}

        {/* Log pane */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <p className="text-slate-500 text-xs font-medium">Logs</p>
            <span className="text-slate-700 text-xs">{logs.length} lines</span>
          </div>
          <div
            ref={logRef}
            className="font-mono text-xs p-4 space-y-0.5 max-h-96 overflow-y-auto"
          >
            {logs.length === 0 ? (
              <p className="text-slate-700 italic">No logs yet…</p>
            ) : (
              logs.map((entry, i) => {
                const line = typeof entry === 'string' ? entry : entry.line
                const level = typeof entry === 'object' ? entry.level : 'info'
                return (
                  <div key={i} className={LOG_COLORS[level] || LOG_COLORS.info}>{line}</div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
