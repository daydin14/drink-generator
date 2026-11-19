import { useCallback } from 'react'
import { ErrorState, EmptyState, LoadingState } from '../components/Status'
import { DrinkDetail } from '../components/DrinkDetail'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cocktailApi } from '../services/cocktailApi'

export function RandomPage() {
  useDocumentTitle('Random')
  const load = useCallback((signal: AbortSignal) => cocktailApi.random(signal), [])
  const { data, error, loading, retry } = useAsync(load)

  return (
    <div className="space-y-8">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <h1 className="font-display text-4xl sm:text-5xl">Pour at random</h1>
          <p className="max-w-xl text-base-content/75">
            One drink from TheCocktailDB, with the glass, ingredients, measures, and method.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={retry} disabled={loading}>
          {loading ? <span className="loading loading-spinner" /> : null}
          Pour another
        </button>
      </header>

      {loading ? <LoadingState label="Shaking something up…" /> : null}
      {error ? <ErrorState message={error} onRetry={retry} /> : null}
      {!loading && !error && data ? <DrinkDetail drink={data} /> : null}
      {!loading && !error && !data ? (
        <EmptyState title="The shaker came back empty." detail="Pour another and the bar will try again." />
      ) : null}
    </div>
  )
}
