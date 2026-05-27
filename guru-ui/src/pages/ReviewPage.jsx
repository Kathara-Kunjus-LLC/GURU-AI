import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { useStaging } from '../hooks/useStaging'
import { renderMarkdown } from '../lib/markdown'

function DomainConfirmModal({ proposals, onConfirm, onCancel }) {
  const [confirmed, setConfirmed] = useState(
    Object.fromEntries(Object.entries(proposals).map(([d, p]) => [d, p]))
  )

  function updateParent(domain, parent) {
    setConfirmed(prev => ({ ...prev, [domain]: parent }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-slate-100 font-semibold mb-1">New Domain Proposals</h2>
        <p className="text-slate-500 text-sm mb-5">
          These domains aren't in the registry yet. Confirm or edit their parent domain before approving.
        </p>
        <div className="space-y-3 mb-6">
          {Object.entries(confirmed).map(([domain, parent]) => (
            <div key={domain} className="flex items-center gap-3">
              <div className="flex-1 text-sm text-slate-300 font-medium">{domain}</div>
              <div className="text-slate-600 text-xs">parent:</div>
              <input
                value={parent}
                onChange={e => updateParent(domain, e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-sm w-36 focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(confirmed)}
            className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Confirm & Approve
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const { notes, loading, fetchNote, updateNote, rejectNote, approveNotes, refresh } = useStaging()

  const [selected, setSelected] = useState(null)      // notePath of selected note
  const [noteContent, setNoteContent] = useState(null) // { content, frontmatter }
  const [rendered, setRendered] = useState('')
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)
  const [checkedPaths, setCheckedPaths] = useState(new Set())
  const [toast, setToast] = useState(null)
  const [domainModal, setDomainModal] = useState(null) // { proposals, decisions }
  const [approving, setApproving] = useState(false)

  // Group notes by chapter
  const grouped = notes.reduce((acc, n) => {
    const ch = n.chapterDir || 'other'
    if (!acc[ch]) acc[ch] = []
    acc[ch].push(n)
    return acc
  }, {})

  async function selectNote(notePath) {
    setSelected(notePath)
    setEditing(false)
    setNoteContent(null)
    setRendered('')
    try {
      const data = await fetchNote(notePath)
      setNoteContent(data)
      setEditText(data.content)
      const html = await renderMarkdown(data.content)
      setRendered(html)
    } catch {}
  }

  useEffect(() => {
    if (notes.length > 0 && !selected) selectNote(notes[0].path)
  }, [notes.length])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSaveEdit() {
    if (!selected) return
    setSaving(true)
    try {
      await updateNote(selected, editText)
      const html = await renderMarkdown(editText)
      setNoteContent(prev => ({ ...prev, content: editText }))
      setRendered(html)
      setEditing(false)
      showToast('Saved')
    } catch {
      showToast('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleReject(notePath) {
    try {
      await rejectNote(notePath)
      if (selected === notePath) {
        setSelected(null)
        setNoteContent(null)
        setRendered('')
      }
      setCheckedPaths(prev => { const n = new Set(prev); n.delete(notePath); return n })
      showToast('Rejected')
    } catch {
      showToast('Failed to reject', 'error')
    }
  }

  function collectNewDomains(decisions) {
    const domainsList = notes
      .filter(n => decisions.find(d => d.path === n.path && d.action === 'approve'))
      .map(n => ({ domain: n.domain, parentDomain: n.parentDomain }))
    // We'd need domains cache to check — for now, detect by checking if domain field looks new
    // The server will handle it; we just surface it if ingest-state.json had proposals
    return {}
  }

  function buildDecisions(paths, action) {
    return paths.map(p => ({ path: p, action }))
  }

  async function runApprove(decisions, newDomains = {}) {
    setApproving(true)
    try {
      const result = await approveNotes(decisions, newDomains)
      const verb = result.moved + result.merged
      showToast(`${verb} note${verb !== 1 ? 's' : ''} approved, ${result.rejected} rejected`)
      if (selected && !notes.find(n => n.path === selected)) {
        setSelected(null)
        setNoteContent(null)
        setRendered('')
      }
      setCheckedPaths(new Set())
    } catch {
      showToast('Approve failed', 'error')
    } finally {
      setApproving(false)
    }
  }

  async function handleApproveSelected() {
    if (checkedPaths.size === 0) return
    const decisions = buildDecisions([...checkedPaths], 'approve')
    await runApprove(decisions)
  }

  async function handleApproveOne(notePath) {
    await runApprove(buildDecisions([notePath], 'approve'))
  }

  function toggleCheck(notePath) {
    setCheckedPaths(prev => {
      const n = new Set(prev)
      n.has(notePath) ? n.delete(notePath) : n.add(notePath)
      return n
    })
  }

  function toggleAll() {
    if (checkedPaths.size === notes.length) {
      setCheckedPaths(new Set())
    } else {
      setCheckedPaths(new Set(notes.map(n => n.path)))
    }
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

  if (notes.length === 0) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <p className="text-slate-300 font-medium mb-2">No staged notes</p>
          <p className="text-slate-600 text-sm mb-6">Process a PDF chapter first to generate notes for review.</p>
          <Link to="/queue" className="inline-block px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
            View Queue
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm shadow-lg transition-all ${
          toast.type === 'error' ? 'bg-red-900/80 text-red-200 border border-red-700' : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
        }`}>
          {toast.msg}
        </div>
      )}

      {domainModal && (
        <DomainConfirmModal
          proposals={domainModal.proposals}
          onConfirm={confirmed => {
            setDomainModal(null)
            runApprove(domainModal.decisions, confirmed)
          }}
          onCancel={() => setDomainModal(null)}
        />
      )}

      <div className="flex h-full">
        {/* Left panel — note list */}
        <div className="w-72 shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checkedPaths.size === notes.length && notes.length > 0}
                onChange={toggleAll}
                className="w-3.5 h-3.5 rounded accent-indigo-500"
              />
              <span className="text-slate-400 text-xs">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
            </div>
            {checkedPaths.size > 0 && (
              <button
                onClick={handleApproveSelected}
                disabled={approving}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Approve {checkedPaths.size}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {Object.entries(grouped).map(([ch, chNotes]) => (
              <div key={ch}>
                <div className="px-4 py-2 text-xs text-slate-600 font-medium uppercase tracking-wider bg-slate-900/50 sticky top-0">
                  {ch}
                </div>
                {chNotes.map(note => (
                  <div
                    key={note.path}
                    className={`px-4 py-2.5 flex items-start gap-2.5 cursor-pointer border-l-2 transition-colors ${
                      selected === note.path
                        ? 'border-indigo-500 bg-slate-800/50'
                        : 'border-transparent hover:bg-slate-900/40'
                    }`}
                    onClick={() => selectNote(note.path)}
                  >
                    <input
                      type="checkbox"
                      checked={checkedPaths.has(note.path)}
                      onChange={e => { e.stopPropagation(); toggleCheck(note.path) }}
                      onClick={e => e.stopPropagation()}
                      className="mt-0.5 w-3.5 h-3.5 rounded accent-indigo-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-slate-300 text-xs leading-snug truncate">{note.title}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {note.domain && (
                          <span className="text-xs text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                            {note.domain}
                          </span>
                        )}
                        {note.isConflict && (
                          <span className="text-xs text-amber-500 bg-amber-900/20 px-1.5 py-0.5 rounded">merge</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — note detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected && noteContent ? (
            <>
              {/* Note header */}
              <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-slate-200 text-sm font-medium truncate">{noteContent.frontmatter?.title}</span>
                  {noteContent.frontmatter?.domain && (
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded shrink-0">
                      {noteContent.frontmatter.domain}
                    </span>
                  )}
                  {notes.find(n => n.path === selected)?.isConflict && (
                    <span className="text-xs text-amber-400 bg-amber-900/20 border border-amber-800/40 px-2 py-0.5 rounded shrink-0">
                      Merges with existing note
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setEditing(e => !e); setEditText(noteContent.content) }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      editing
                        ? 'border-indigo-500 text-indigo-300'
                        : 'border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {editing ? 'Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleReject(selected)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-red-400 hover:text-red-300 hover:border-red-800 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveOne(selected)}
                    disabled={approving}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {editing ? (
                  <div className="flex flex-col h-full p-6">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 text-xs font-mono resize-none focus:outline-none focus:border-indigo-500"
                      spellCheck={false}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => setEditing(false)} className="text-sm text-slate-500 hover:text-slate-300 px-4 py-2">Cancel</button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="px-8 py-6 note-content"
                    dangerouslySetInnerHTML={{ __html: rendered }}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-700 text-sm">
              Select a note to review
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
