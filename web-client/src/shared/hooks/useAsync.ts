import { useCallback, useEffect, useState } from 'react'
import { errorMessage } from '../utils/errors'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  setData: React.Dispatch<React.SetStateAction<T | null>>
}

export function useAsync<T>(fn: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn()
      setData(res)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [fn])

  useEffect(() => {
    void execute()
  }, [execute])

  return { data, loading, error, reload: execute, setData }
}

