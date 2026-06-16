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
  const { notes, loading, fetchNote, updateNote, rejectNote, approveNotes, exportNotes, exportNotesMcp, refresh } = useStaging()

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
  const [confirmExport, setConfirmExport] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [mcpPolicy, setMcpPolicy] = useState('overwrite')
  const [mcpExporting, setMcpExporting] = useState(false)
  const [mcpResult, setMcpResult] = useState(null) // agent summary text

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

  async function handleExport() {
    setExporting(true)
    try {
      const result = await exportNotes()
      const total = result.exported + result.overwritten
      showToast(`Exported ${total} note${total !== 1 ? 's' : ''} to vault (${result.overwritten} overwritten)`)
      setSelected(null)
      setNoteContent(null)
      setRendered('')
      setCheckedPaths(new Set())
    } catch {
      showToast('Export failed', 'error')
    } finally {
      setExporting(false)
      setConfirmExport(false)
    }
  }

  async function handleMcpExport() {
    setMcpExporting(true)
    try {
      const result = await exportNotesMcp(mcpPolicy)
      setMcpResult(result.output || '(no output returned)')
      setSelected(null)
      setNoteContent(null)
      setRendered('')
      setCheckedPaths(new Set())
      showToast(result.ok ? 'MCP export finished' : 'MCP export finished with errors', result.ok ? 'success' : 'error')
    } catch (e) {
      showToast(e.message || 'MCP export failed', 'error')
    } finally {
      setMcpExporting(false)
    }
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

      {confirmExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-slate-100 font-semibold mb-1">Export to Obsidian vault</h2>
            <p className="text-slate-500 text-sm mb-5">
              Write all {notes.length} staged note{notes.length !== 1 ? 's' : ''} into the vault. Notes with the same
              name are <span className="text-slate-300">overwritten</span>; all other vault notes are left untouched.
              Nothing is deleted. Staging is cleared afterward.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {exporting ? 'Exporting…' : 'Export & overwrite'}
              </button>
              <button
                onClick={() => setConfirmExport(false)}
                disabled={exporting}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {mcpResult !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
            <h2 className="text-slate-100 font-semibold mb-3">MCP export summary</h2>
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 text-xs whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
              {mcpResult}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setMcpResult(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
            <div className="flex items-center gap-3">
              {checkedPaths.size > 0 && (
                <button
                  onClick={handleApproveSelected}
                  disabled={approving}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Approve {checkedPaths.size}
                </button>
              )}
              <button
                onClick={() => setConfirmExport(true)}
                disabled={exporting || notes.length === 0}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-40"
                title="Write all staged notes into the Obsidian vault, overwriting matching notes"
              >
                Export to vault
              </button>
            </div>
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

          {/* MCP export footer — conflict-aware push to the real Obsidian vault */}
          <div className="px-4 py-3 border-t border-slate-800 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-600">
              Export to Obsidian (MCP)
            </div>
            <div className="flex items-center gap-2">
              <select
                value={mcpPolicy}
                onChange={e => setMcpPolicy(e.target.value)}
                disabled={mcpExporting}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="overwrite">Overwrite conflicts</option>
                <option value="skip">Skip conflicts</option>
              </select>
              <button
                onClick={handleMcpExport}
                disabled={mcpExporting || notes.length === 0}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 shrink-0"
                title="Run the conflict-aware agent export into the live Vedam vault"
              >
                {mcpExporting ? 'Running…' : 'Run'}
              </button>
            </div>
            {mcpExporting && (
              <p className="text-[10px] text-slate-600 leading-snug">
                Agent is checking each note against the live vault — this can take a minute.
              </p>
            )}
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
