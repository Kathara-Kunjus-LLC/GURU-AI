import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useJobs } from '../hooks/useJobs'

const STRATEGY_LABELS = {
  single: { label: 'single call', color: 'text-emerald-400' },
  'split-by-section': { label: 'split by section', color: 'text-indigo-400' },
  'sliding-window': { label: 'sliding window', color: 'text-amber-400' },
}

function strategyForTokens(tokens) {
  if (tokens < 15000) return 'single'
  if (tokens < 40000) return 'split-by-section'
  return 'sliding-window'
}

export default function IngestPage() {
  const navigate = useNavigate()
  const { createJob } = useJobs()

  const [phase, setPhase] = useState('idle') // idle | uploading | extracting | ready | submitting
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extractResult, setExtractResult] = useState(null)
  const [extractLogs, setExtractLogs] = useState([])
  const [selectedChapters, setSelectedChapters] = useState(new Set())
  const [error, setError] = useState(null)
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please provide a PDF file.')
      return
    }
    setError(null)
    setPhase('uploading')
    setExtractLogs([])
    setExtractResult(null)
    setSelectedChapters(new Set())

    try {
      const formData = new FormData()
      formData.append('pdf', file)
      const uploadRes = await fetch('/api/pipeline/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const uploaded = await uploadRes.json()
      setUploadedFile(uploaded)
      setPhase('extracting')

      const extractRes = await fetch('/api/pipeline/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: uploaded.filename }),
      })
      const extractData = await extractRes.json()
      if (!extractRes.ok) throw new Error(extractData.error || 'Extract failed')

      setExtractLogs(extractData.logs || [])
      setExtractResult(extractData)
      setPhase('ready')
    } catch (err) {
      setError(err.message)
      setPhase('idle')
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onFileInput(e) {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  function toggleChapter(num) {
    setSelectedChapters(prev => {
      const next = new Set(prev)
      next.has(num) ? next.delete(num) : next.add(num)
      return next
    })
  }

  function selectAll() {
    setSelectedChapters(new Set(extractResult.chapters.map(c => c.number)))
  }

  async function submitQueue() {
    if (selectedChapters.size === 0) return
    setPhase('submitting')
    try {
      const chaptersToQueue = extractResult.chapters.filter(c => selectedChapters.has(c.number))
      for (const ch of chaptersToQueue) {
        await createJob({
          bookSlug: extractResult.bookSlug,
          bookTitle: extractResult.bookTitle,
          chapter: ch.number,
          chapterTitle: ch.title,
        })
      }
      navigate('/queue')
    } catch (err) {
      setError(err.message)
      setPhase('ready')
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-slate-100 text-lg font-semibold mb-1">Ingest PDF</h1>
        <p className="text-slate-500 text-sm mb-8">Drop a textbook PDF to extract chapters and queue them for note generation.</p>

        {/* Drop zone */}
        {(phase === 'idle' || phase === 'uploading') && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/40'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={onFileInput} />
            {phase === 'uploading' ? (
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Uploading…
              </div>
            ) : (
              <>
                <div className="text-3xl mb-3">📄</div>
                <p className="text-slate-300 text-sm font-medium">Drop PDF here or click to browse</p>
                <p className="text-slate-600 text-xs mt-1">Textbook PDFs with a table of contents work best</p>
              </>
            )}
          </div>
        )}

        {/* Extracting */}
        {phase === 'extracting' && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Extracting chapters from <span className="text-slate-100 font-medium">{uploadedFile?.filename}</span>…
            </div>
            <div className="font-mono text-xs text-slate-500 space-y-0.5 max-h-32 overflow-auto">
              {extractLogs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        )}

        {/* Ready — chapter list */}
        {phase === 'ready' && extractResult && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-slate-100 font-medium">{extractResult.bookTitle}</p>
                  <p className="text-slate-500 text-xs">{extractResult.author} · {extractResult.totalPages} pages · {extractResult.chapters.length} chapters</p>
                </div>
                <button onClick={() => { setPhase('idle'); setExtractResult(null) }} className="text-slate-600 hover:text-slate-400 text-xs">
                  Change PDF
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">Select chapters to process</p>
              <button onClick={selectAll} className="text-indigo-400 hover:text-indigo-300 text-xs">Select all</button>
            </div>

            <div className="space-y-1.5">
              {extractResult.chapters.map(ch => {
                const strategy = strategyForTokens(ch.estimatedTokens)
                const strat = STRATEGY_LABELS[strategy]
                const selected = selectedChapters.has(ch.number)
                return (
                  <button
                    key={ch.number}
                    onClick={() => toggleChapter(ch.number)}
                    className={`w-full text-left rounded-lg border px-4 py-3 flex items-center gap-3 transition-colors ${
                      selected
                        ? 'border-indigo-500/50 bg-indigo-500/8'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                    }`}>
                      {selected && <span className="text-white text-xs leading-none">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-300 text-sm">Ch. {ch.number} — {ch.title}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-600 text-xs">~{(ch.estimatedTokens / 1000).toFixed(0)}k tokens</span>
                      <span className={`text-xs ${strat.color}`}>{strat.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={submitQueue}
              disabled={selectedChapters.size === 0 || phase === 'submitting'}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {phase === 'submitting'
                ? 'Adding to queue…'
                : `Add ${selectedChapters.size} chapter${selectedChapters.size !== 1 ? 's' : ''} to queue`}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
            {error}
          </div>
        )}
      </div>
    </AppShell>
  )
}
