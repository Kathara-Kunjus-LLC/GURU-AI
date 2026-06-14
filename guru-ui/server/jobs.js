import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CHUNK_PROGRESS = /\[ingest\] Chunk (\d+)\/(\d+)/
const SUMMARY_START = /=== .+? summary ===/
const TOKEN_PATTERNS = {
  inputTokens: /Input:\s+([\d,]+)/,
  outputTokens: /Output:\s+([\d,]+)/,
  cacheCreation: /Cache creation:\s+([\d,]+)/,
  cacheReads: /Cache reads:\s+([\d,]+)/,
  noteCount: /Notes:\s+(\d+)/,
}

let _wss = null
let _projectRoot = null
let _python = 'python3'

const store = new Map()
let queue = []
let running = false

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function persist() {
  if (!_projectRoot) return
  const cachePath = path.join(_projectRoot, 'cache', 'jobs.json')
  const serializable = [...store.values()]
    .map(({ sseClients, ...rest }) => rest)
    .slice(-100)
  try {
    fs.writeFileSync(cachePath, JSON.stringify(serializable, null, 2))
  } catch {}
}

// ---------------------------------------------------------------------------
// WebSocket broadcast
// ---------------------------------------------------------------------------

function broadcast(msg) {
  if (!_wss) return
  const data = JSON.stringify(msg)
  _wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(data)
  })
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

export function init(wss, projectRoot, python = 'python3') {
  _wss = wss
  _projectRoot = projectRoot
  _python = python

  const cachePath = path.join(projectRoot, 'cache', 'jobs.json')
  if (fs.existsSync(cachePath)) {
    try {
      const saved = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))
      for (const job of saved) {
        job.sseClients = new Set()
        if (job.status === 'running' || job.status === 'queued') {
          job.status = 'failed'
          job.error = 'Server restarted — requeue to retry'
        }
        store.set(job.id, job)
      }
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function createJob({ bookSlug, bookTitle, chapter, chapterTitle, resume = false }) {
  const job = {
    id: randomUUID(),
    bookSlug,
    bookTitle,
    chapter: Number(chapter),
    chapterTitle,
    status: 'queued',
    currentStep: null,
    progress: { done: 0, total: 0 },
    logs: [],
    sseClients: new Set(),
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    summary: null,
    error: null,
    resume,
    pauseInfo: null,
  }
  store.set(job.id, job)
  return job
}

export function enqueue(job) {
  queue.push(job.id)
  persist()
  if (!running) runNext()
}

export function requeueJob(id) {
  const job = store.get(id)
  if (!job) return null
  if (job.status !== 'paused' && job.status !== 'failed') return null

  job.logs.push({ line: '[runner] ─── Resuming job ───', level: 'info', ts: Date.now() })
  Object.assign(job, {
    status: 'queued',
    currentStep: null,
    pauseInfo: null,
    error: null,
    startedAt: null,
    completedAt: null,
    summary: null,
    resume: true,
  })

  broadcast({
    type: 'job-update',
    data: { id, status: job.status, progress: job.progress, currentStep: null,
            bookSlug: job.bookSlug, bookTitle: job.bookTitle,
            chapter: job.chapter, chapterTitle: job.chapterTitle },
  })
  const statusMsg = JSON.stringify({ type: 'status', status: 'queued', summary: null, pauseInfo: null })
  job.sseClients.forEach(res => res.write(`data: ${statusMsg}\n\n`))

  persist()
  queue.push(id)
  if (!running) runNext()
  return job
}

export function getJob(id) {
  return store.get(id) || null
}

export function getAllJobs() {
  return [...store.values()].map(({ sseClients, logs, ...meta }) => ({
    ...meta,
    logCount: logs.length,
  }))
}

export function getJobWithLogs(id) {
  const job = store.get(id)
  if (!job) return null
  const { sseClients, ...rest } = job
  return { ...rest, logs: rest.logs.slice(-200) }
}

export function deleteJob(id) {
  const job = store.get(id)
  if (!job || job.status === 'running') return false
  store.delete(id)
  queue = queue.filter(qid => qid !== id)
  persist()
  return true
}

export function clearJobs(filter = 'inactive') {
  const removable = filter === 'all'
    ? ['completed', 'failed', 'paused']
    : ['completed', 'failed', 'paused']
  // 'queued' and 'running' are never bulk-deleted for safety
  let count = 0
  for (const [id, job] of store.entries()) {
    if (removable.includes(job.status)) {
      store.delete(id)
      count++
    }
  }
  queue = queue.filter(id => store.has(id))
  persist()
  return count
}

export function addSseClient(id, res) {
  const job = store.get(id)
  if (!job) return false
  job.sseClients.add(res)
  // Replay existing log buffer
  for (const entry of job.logs.slice(-200)) {
    res.write(`data: ${JSON.stringify({ type: 'log', line: entry.line, level: entry.level })}\n\n`)
  }
  res.write(`data: ${JSON.stringify({ type: 'progress', ...job.progress })}\n\n`)
  res.write(`data: ${JSON.stringify({ type: 'status', status: job.status, summary: job.summary })}\n\n`)
  return true
}

export function removeSseClient(id, res) {
  const job = store.get(id)
  if (job) job.sseClients.delete(res)
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function appendLog(id, line, level = 'info') {
  const job = store.get(id)
  if (!job) return
  const entry = { line, level, ts: Date.now() }
  job.logs.push(entry)
  if (job.logs.length > 500) job.logs.shift()
  const msg = JSON.stringify({ type: 'log', line, level })
  job.sseClients.forEach(res => res.write(`data: ${msg}\n\n`))
}

function updateJob(id, fields) {
  const job = store.get(id)
  if (!job) return
  Object.assign(job, fields)
  broadcast({
    type: 'job-update',
    data: {
      id,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      bookSlug: job.bookSlug,
      bookTitle: job.bookTitle,
      chapter: job.chapter,
      chapterTitle: job.chapterTitle,
    },
  })
  const statusMsg = JSON.stringify({ type: 'status', status: job.status, summary: job.summary, pauseInfo: job.pauseInfo })
  job.sseClients.forEach(res => res.write(`data: ${statusMsg}\n\n`))
  persist()
}

function spawnScript(id, cmd, args, cwd) {
  return new Promise(resolve => {
    // PYTHONUNBUFFERED forces line-by-line stdout so chunk progress streams to
    // the UI live instead of arriving in one block when the process exits.
    const proc = spawn(cmd, args, { cwd, env: { ...process.env, PYTHONUNBUFFERED: '1' } })
    let inSummary = false
    const summaryLines = []

    proc.stdout.on('data', data => {
      const lines = data.toString().split('\n').filter(l => l.trim())
      for (const line of lines) {
        const level = line.includes('[WARN]') ? 'warn' : 'info'
        appendLog(id, line, level)

        const pm = line.match(CHUNK_PROGRESS)
        if (pm) {
          const done = parseInt(pm[1])
          const total = parseInt(pm[2])
          const job = store.get(id)
          if (job) {
            job.progress = { done, total }
            broadcast({ type: 'job-update', data: { id, progress: job.progress } })
            const progressMsg = JSON.stringify({ type: 'progress', done, total })
            job.sseClients.forEach(res => res.write(`data: ${progressMsg}\n\n`))
          }
        }

        if (SUMMARY_START.test(line)) inSummary = true
        if (inSummary) summaryLines.push(line)
      }
    })

    proc.stderr.on('data', data => {
      data.toString().split('\n').filter(l => l.trim()).forEach(line => {
        appendLog(id, line, 'error')
      })
    })

    proc.on('close', code => {
      let summary = null
      if (summaryLines.length > 0) {
        const block = summaryLines.join('\n')
        summary = {}
        for (const [key, pattern] of Object.entries(TOKEN_PATTERNS)) {
          const m = block.match(pattern)
          if (m) summary[key] = parseInt(m[1].replace(/,/g, ''))
        }
        const bridgeLines = block.match(/  - .+ — .+/g) || []
        summary.bridges = bridgeLines.map(l => l.replace(/^  - /, '').split(' — ')[0])
      }
      resolve({ code, summary, summaryText: summaryLines.join('\n') })
    })

    proc.on('error', err => {
      appendLog(id, `[runner] Process error: ${err.message}`, 'error')
      resolve({ code: 1, summary: null, summaryText: '' })
    })
  })
}

// ---------------------------------------------------------------------------
// Sequential runner
// ---------------------------------------------------------------------------

async function runNext() {
  if (queue.length === 0) { running = false; return }
  running = true

  const id = queue.shift()
  const job = store.get(id)
  if (!job) { runNext(); return }

  updateJob(id, { status: 'running', startedAt: new Date().toISOString() })
  appendLog(id, `[runner] Starting: ${job.bookTitle} Ch.${job.chapter} — ${job.chapterTitle}`)

  const pythonCmd = _python
  const cwd = _projectRoot
  const scriptsDir = path.join(_projectRoot, 'scripts')

  // Step 1: chunk.py
  updateJob(id, { currentStep: 'chunk' })
  appendLog(id, '[runner] Step 1/3: chunking text...')
  const { code: chunkCode } = await spawnScript(
    id,
    pythonCmd,
    [path.join(scriptsDir, 'chunk.py'), job.bookSlug, String(job.chapter), '--force'],
    cwd
  )

  if (chunkCode !== 0) {
    updateJob(id, {
      status: 'failed',
      currentStep: null,
      completedAt: new Date().toISOString(),
      error: 'chunk.py failed — check logs',
    })
    runNext()
    return
  }

  // Step 2: batch_ingest.py
  updateJob(id, { currentStep: 'process' })
  appendLog(id, '[runner] Step 2/3: ingesting with Claude...')

  const chapterDomainArgs = []
  try {
    const metaPath = path.join(_projectRoot, 'pdfs', 'cache', job.bookSlug, 'meta.json')
    const bookMeta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    const chapterMeta = bookMeta.chapters?.[String(job.chapter)]
    if (chapterMeta?.domain) chapterDomainArgs.push('--chapter-domain', chapterMeta.domain)
    if (chapterMeta?.['parent-domain']) chapterDomainArgs.push('--parent-domain', chapterMeta['parent-domain'])
  } catch {}

  const { code: ingestCode, summary } = await spawnScript(
    id,
    pythonCmd,
    [
      path.join(scriptsDir, 'batch_ingest.py'),
      job.bookSlug,
      String(job.chapter),
      ...(job.resume ? ['--resume'] : []),
      ...chapterDomainArgs,
    ],
    cwd
  )

  if (ingestCode === 2) {
    // Both providers rate-limited — read provider status from saved state
    let pauseInfo = null
    try {
      const statePath = path.join(_projectRoot, 'cache', 'ingest-state.json')
      const rawState = JSON.parse(fs.readFileSync(statePath, 'utf-8'))
      const providers = rawState.providers || {}
      const resets = Object.values(providers)
        .filter(p => p.status === 'rate_limited' && p.reset_at)
        .map(p => p.reset_at)
        .sort()
      pauseInfo = { providers, resumeAt: resets.length > 0 ? resets[0] : null }
    } catch {}
    updateJob(id, {
      status: 'paused',
      currentStep: null,
      completedAt: new Date().toISOString(),
      pauseInfo,
      error: null,
    })
    appendLog(id, '[runner] Job paused — rate limit reached. Click Resume when tokens refresh.')
  } else if (ingestCode !== 0) {
    updateJob(id, {
      status: 'failed',
      currentStep: null,
      completedAt: new Date().toISOString(),
      error: 'batch_ingest.py failed — check logs',
    })
  } else {
    // Step 3: review.py — deterministic lint. Never fails the job; flagged
    // notes are surfaced for the user to handle in the approve UI.
    updateJob(id, { currentStep: 'review' })
    appendLog(id, '[runner] Step 3/3: linting staged notes...')
    const chapterLabel = `ch${String(job.chapter).padStart(2, '0')}`
    const { code: reviewCode, summaryText: reviewText } = await spawnScript(
      id,
      pythonCmd,
      [path.join(scriptsDir, 'review.py'), chapterLabel],
      cwd
    )

    let review = null
    if (reviewText) {
      const grab = re => { const m = reviewText.match(re); return m ? parseInt(m[1]) : null }
      review = {
        reviewed: grab(/Notes reviewed:\s+(\d+)/),
        autoApproved: grab(/Auto-approved:\s+(\d+)/),
        flagged: grab(/Flagged:\s+(\d+)/),
      }
    }
    if (reviewCode !== 0) {
      appendLog(id, '[runner] review.py did not complete cleanly — skipping lint summary.', 'warn')
    } else if (review && review.flagged != null) {
      appendLog(id, `[runner] Lint: ${review.autoApproved}/${review.reviewed} auto-approved, ${review.flagged} flagged for review.`)
    }

    updateJob(id, {
      status: 'completed',
      currentStep: null,
      completedAt: new Date().toISOString(),
      summary: { ...(summary || {}), review },
    })
    appendLog(id, '[runner] Job completed successfully.')
  }

  runNext()
}
