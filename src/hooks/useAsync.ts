import { useCallback, useEffect, useState } from 'react'

export interface AsyncState<T> {
  data: T | null
  error: string | null
  loading: boolean
  retry: () => void
}

interface Store<T> {
  key: string
  status: 'loading' | 'ready' | 'error'
  data: T | null
  error: string | null
}

function messageFrom(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) return error.message
  return 'Something went wrong. Please try again.'
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function freshStore<T>(key: string, enabled: boolean): Store<T> {
  return {
    key,
    status: enabled ? 'loading' : 'ready',
    data: null,
    error: null,
  }
}

export function useAsync<T>(
  query: (signal: AbortSignal) => Promise<T>,
  enabled = true,
): AsyncState<T> {
  const [attempt, setAttempt] = useState(0)
  const [trackedQuery, setTrackedQuery] = useState({ query, generation: 0 })

  if (trackedQuery.query !== query) {
    setTrackedQuery({ query, generation: trackedQuery.generation + 1 })
  }

  const generation = trackedQuery.query === query ? trackedQuery.generation : trackedQuery.generation + 1
  const key = `${enabled ? 1 : 0}:${attempt}:${generation}`
  const [store, setStore] = useState<Store<T>>(() => freshStore(key, enabled))

  if (store.key !== key) {
    setStore(freshStore(key, enabled))
  }

  const current = store.key === key ? store : freshStore<T>(key, enabled)

  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()
    let active = true

    query(controller.signal)
      .then((result) => {
        if (!active) return
        setStore({ key, status: 'ready', data: result, error: null })
      })
      .catch((caught: unknown) => {
        if (!active || isAbortError(caught)) return
        setStore({ key, status: 'error', data: null, error: messageFrom(caught) })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, key, query])

  const retry = useCallback(() => {
    setAttempt((value) => value + 1)
  }, [])

  return {
    data: current.data,
    error: current.error,
    loading: current.status === 'loading',
    retry,
  }
}
