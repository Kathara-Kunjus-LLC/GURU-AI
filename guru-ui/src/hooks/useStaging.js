import { useState, useEffect, useCallback } from 'react'

export function useStaging() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchStaging() {
    try {
      const res = await fetch('/api/staging')
      if (!res.ok) throw new Error('Failed')
      setNotes(await res.json())
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStaging() }, [])

  async function fetchNote(notePath) {
    const res = await fetch(`/api/staging/note?path=${encodeURIComponent(notePath)}`)
    if (!res.ok) throw new Error('Note not found')
    return res.json()
  }

  async function updateNote(notePath, content) {
    const res = await fetch(`/api/staging/note?path=${encodeURIComponent(notePath)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error('Failed to save')
  }

  async function rejectNote(notePath) {
    const res = await fetch(`/api/staging/note?path=${encodeURIComponent(notePath)}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to reject')
    setNotes(prev => prev.filter(n => n.path !== notePath))
  }

  async function approveNotes(decisions, newDomains = {}) {
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisions, newDomains }),
    })
    if (!res.ok) throw new Error('Approve failed')
    const result = await res.json()
    const approved = decisions.filter(d => d.action === 'approve').map(d => d.path)
    const rejected = decisions.filter(d => d.action === 'reject').map(d => d.path)
    setNotes(prev => prev.filter(n => !approved.includes(n.path) && !rejected.includes(n.path)))
    return result
  }

  async function exportNotes() {
    const res = await fetch('/api/export', { method: 'POST' })
    if (!res.ok) throw new Error('Export failed')
    const result = await res.json()
    // Export consumes every staged note, so clear the list.
    setNotes([])
    return result
  }

  // MCP export runs the agent against the live Vedam vault. It may consume only
  // some notes (skipped conflicts stay), so re-fetch instead of clearing.
  async function exportNotesMcp(policy) {
    const res = await fetch('/api/export-mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || 'MCP export failed')
    await fetchStaging()
    return result
  }

  return { notes, loading, fetchNote, updateNote, rejectNote, approveNotes, exportNotes, exportNotesMcp, refresh: fetchStaging }
}
