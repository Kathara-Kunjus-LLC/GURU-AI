import { useState, useEffect } from 'react'

const IS_DEPLOY = import.meta.env.VITE_DEPLOY === 'true'

export function useNote(title) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!title) {
      setData(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const url = IS_DEPLOY
      ? `/notes/${encodeURIComponent(title)}.json`
      : `/api/note/${encodeURIComponent(title)}`

    fetch(url)
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
