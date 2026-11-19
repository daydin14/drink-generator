import { useCallback } from 'react'
import { Link } from 'react-router'
import { DrinkCard } from '../components/DrinkCard'
import { ErrorState, LoadingState } from '../components/Status'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cocktailApi } from '../services/cocktailApi'

export function HomePage() {
  useDocumentTitle()
  const loadCategories = useCallback(() => cocktailApi.listCategories(), [])
  const loadFeatured = useCallback((signal: AbortSignal) => cocktailApi.random(signal), [])
  const categories = useAsync(loadCategories)
  const featured = useAsync(loadFeatured)

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">TheCocktailDB</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">Find your next drink.</h1>
          <p className="max-w-xl text-lg text-base-content/75">
            Search by name, filter by what is already in the cabinet, or pour something at random.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/random" className="btn btn-primary">
              Surprise me
            </Link>
            <Link to="/search" className="btn btn-outline">
              Search drinks
            </Link>
          </div>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100/70 p-4 shadow-lg">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl">First pour</h2>
            <Link to="/random" className="link link-hover text-sm">
              Pour another
            </Link>
          </div>
          {featured.loading ? <LoadingState label="Choosing a drink…" /> : null}
          {featured.error ? <ErrorState message={featured.error} onRetry={featured.retry} /> : null}
          {!featured.loading && !featured.error && featured.data ? (
            <ul className="grid grid-cols-1">
              <DrinkCard drink={featured.data} />
            </ul>
          ) : null}
          {!featured.loading && !featured.error && !featured.data ? (
            <p className="py-8 text-center text-base-content/70">No drink came back. Try another pour.</p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="space-y-4">
        <div>
          <h2 id="categories-heading" className="font-display text-3xl">
            Browse by category
          </h2>
          <p className="mt-1 text-base-content/70">Each category opens a list, and a drink opens its full recipe.</p>
        </div>
        {categories.loading ? <LoadingState label="Loading categories…" /> : null}
        {categories.error ? <ErrorState message={categories.error} onRetry={categories.retry} /> : null}
        {categories.data ? (
          <ul className="flex flex-wrap gap-2">
            {categories.data.map((category) => (
              <li key={category}>
                <Link
                  to={{ pathname: '/search', search: `?${new URLSearchParams({ category }).toString()}` }}
                  className="btn btn-outline btn-sm"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  )
}
