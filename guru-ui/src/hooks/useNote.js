import { useState, useEffect } from 'react'

const IS_DEPLOY = import.meta.env.VITE_DEPLOY === 'true'

export function useNote(title, vaultData) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!title) {
      setData(null)
      setError(null)
      return
    }

    if (IS_DEPLOY) {
      const node = vaultData?.nodes?.find(n => n.id === title)
      if (node) {
        setData(node)
        setError(null)
      } else {
        setData(null)
        setError('Note not found')
      }
      return
    }

    setLoading(true)
    setError(null)
    fetch(`/api/note/${encodeURIComponent(title)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`)
        return res.json()
      })
      .then(json => {
        setData(json)
        setError(null)
      })
      .catch(err => {
        setData(null)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [title])

  return { data, loading, error }
}
