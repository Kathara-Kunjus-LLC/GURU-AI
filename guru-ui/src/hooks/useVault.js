import { useState, useEffect, useRef } from 'react'

const IS_DEPLOY = import.meta.env.VITE_DEPLOY === 'true'

export function useVault({ includeStaging = false } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(true)
  const wsRef = useRef(null)
  const retryRef = useRef(1000)
  const timeoutRef = useRef(null)

  async function fetchGraph() {
    try {
      let url
      if (IS_DEPLOY) {
        url = '/graph.json'
      } else {
        url = includeStaging ? '/api/graph?include=staging' : '/api/graph'
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      const json = await res.json()
      setData(json)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGraph()

    if (IS_DEPLOY) return

    function connect() {
      const ws = new WebSocket('ws://localhost:3001')
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        retryRef.current = 1000
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'refresh') setData(msg.data)
        } catch {}
      }

      ws.onclose = () => {
        setConnected(false)
        timeoutRef.current = setTimeout(() => {
          retryRef.current = Math.min(retryRef.current * 2, 30000)
          connect()
        }, retryRef.current)
      }
    }

    connect()

    return () => {
      clearTimeout(timeoutRef.current)
      wsRef.current?.close()
    }
  }, [includeStaging])

  return { data, loading, error, connected }
}
