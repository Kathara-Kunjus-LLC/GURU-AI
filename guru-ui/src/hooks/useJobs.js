import { useState, useEffect, useRef } from 'react'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  async function fetchJobs() {
    try {
      const res = await fetch('/api/jobs')
      if (!res.ok) throw new Error('Failed')
      setJobs(await res.json())
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()

    // Poll every 3s as fallback; WebSocket updates are primary
    intervalRef.current = setInterval(fetchJobs, 3000)

    // Listen for job-update events on the existing vault WebSocket
    function onMessage(e) {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'job-update') {
          setJobs(prev => {
            const idx = prev.findIndex(j => j.id === msg.data.id)
            if (idx === -1) {
              fetchJobs()  // New job — full refresh
              return prev
            }
            const updated = [...prev]
            updated[idx] = { ...updated[idx], ...msg.data }
            return updated
          })
        }
      } catch {}
    }

    // Attach to the existing WS if available (best-effort)
    window.__guruWsListeners = window.__guruWsListeners || []
    window.__guruWsListeners.push(onMessage)

    return () => {
      clearInterval(intervalRef.current)
      window.__guruWsListeners = (window.__guruWsListeners || []).filter(l => l !== onMessage)
    }
  }, [])

  async function createJob(config) {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (!res.ok) throw new Error('Failed to create job')
    const job = await res.json()
    setJobs(prev => [job, ...prev])
    return job
  }

  return { jobs, loading, createJob, refresh: fetchJobs }
}
