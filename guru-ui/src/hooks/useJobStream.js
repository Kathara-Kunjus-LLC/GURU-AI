import { useState, useEffect, useRef } from 'react'

const TERMINAL = new Set(['completed', 'failed', 'paused'])

export function useJobStream(jobId, initialJob, resumeKey = 0) {
  const [logs, setLogs] = useState(initialJob?.logs || [])
  const [progress, setProgress] = useState(initialJob?.progress || { done: 0, total: 0 })
  const [status, setStatus] = useState(initialJob?.status || null)
  const [summary, setSummary] = useState(initialJob?.summary || null)
  const [pauseInfo, setPauseInfo] = useState(initialJob?.pauseInfo || null)
  const esRef = useRef(null)

  useEffect(() => {
    if (!jobId) return

    if (initialJob) {
      setLogs(initialJob.logs || [])
      setProgress(initialJob.progress || { done: 0, total: 0 })
      setStatus(initialJob.status)
      setSummary(initialJob.summary)
      setPauseInfo(initialJob.pauseInfo || null)
    }

    // Don't open SSE if already terminal — unless resumeKey > 0 (explicit reconnect)
    if (resumeKey === 0 && initialJob?.status && TERMINAL.has(initialJob.status)) return

    if (esRef.current) esRef.current.close()

    const es = new EventSource(`/api/jobs/${jobId}/stream`)
    esRef.current = es

    es.onmessage = e => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'log') {
          setLogs(prev => [...prev, { line: msg.line, level: msg.level || 'info', ts: Date.now() }])
        } else if (msg.type === 'progress') {
          setProgress({ done: msg.done, total: msg.total })
        } else if (msg.type === 'status') {
          setStatus(msg.status)
          if (msg.summary) setSummary(msg.summary)
          if (msg.pauseInfo !== undefined) setPauseInfo(msg.pauseInfo)
          if (TERMINAL.has(msg.status)) es.close()
        }
      } catch {}
    }

    es.onerror = () => es.close()

    return () => es.close()
  }, [jobId, resumeKey])

  return { logs, progress, status, summary, pauseInfo }
}
