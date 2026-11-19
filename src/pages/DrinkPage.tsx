import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { DrinkDetail } from '../components/DrinkDetail'
import { EmptyState, ErrorState, LoadingState } from '../components/Status'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cocktailApi } from '../services/cocktailApi'

export function DrinkPage() {
  const { id = '' } = useParams()
  const load = useCallback((signal: AbortSignal) => cocktailApi.lookup(id, signal), [id])
  const { data, error, loading, retry } = useAsync(load, id.length > 0)

  useDocumentTitle(data?.name ?? 'Drink')

  return (
    <div className="space-y-6">
      <nav aria-label="Drink" className="flex flex-wrap gap-4 text-sm">
        <Link to="/search" className="link link-hover">
          Back to search
        </Link>
        <Link to="/random" className="link link-hover">
          Pour a random drink
        </Link>
      </nav>

      {loading ? <LoadingState label="Loading the recipe…" /> : null}
      {error ? <ErrorState message={error} onRetry={retry} /> : null}
      {!loading && !error && data ? <DrinkDetail drink={data} /> : null}
      {!loading && !error && !data ? (
        <EmptyState
          title="That drink is not on the menu."
          detail="The id did not match a cocktail. Search by name or pour one at random."
        />
      ) : null}
    </div>
  )
}
