import { useCallback, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { ResultsGrid } from '../components/ResultsGrid'
import { EmptyState, ErrorState, LoadingState } from '../components/Status'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cocktailApi, usesTestKey } from '../services/cocktailApi'
import type { DrinkPreview } from '../types/drink'

type SearchTab = 'name' | 'ingredient' | 'category'

export function SearchPage() {
  useDocumentTitle('Search')
  const [params, setParams] = useSearchParams()
  const name = params.get('q')?.trim() ?? ''
  const ingredient = params.get('ingredient')?.trim() ?? ''
  const category = params.get('category')?.trim() ?? ''
  const activeQuery = Boolean(name || ingredient || category)

  const urlTab: SearchTab | null = ingredient ? 'ingredient' : category ? 'category' : name ? 'name' : null
  const [overrideTab, setOverrideTab] = useState<SearchTab | null>(null)
  const tab = overrideTab ?? urlTab ?? 'name'
  const [nameState, setNameState] = useState({ source: name, draft: name })
  if (nameState.source !== name) {
    setNameState({ source: name, draft: name })
  }
  const nameDraft = nameState.source === name ? nameState.draft : name

  const [pickedIngredient, setPickedIngredient] = useState({ source: ingredient, value: ingredient })
  if (pickedIngredient.source !== ingredient) {
    setPickedIngredient({ source: ingredient, value: ingredient })
  }
  const selectedIngredient = pickedIngredient.source === ingredient ? pickedIngredient.value : ingredient

  const [ingredientFilter, setIngredientFilter] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const loadCategories = useCallback(() => cocktailApi.listCategories(), [])
  const loadIngredients = useCallback(() => cocktailApi.listIngredients(), [])
  const categories = useAsync(loadCategories, tab === 'category')
  const ingredients = useAsync(loadIngredients, tab === 'ingredient')

  const loadResults = useCallback(
    (signal: AbortSignal) => {
      if (name) return cocktailApi.searchByName(name, signal)
      if (ingredient) return cocktailApi.filterByIngredient(ingredient, signal)
      if (category) return cocktailApi.filterByCategory(category, signal)
      return Promise.resolve([] as DrinkPreview[])
    },
    [name, ingredient, category],
  )
  const results = useAsync(loadResults, activeQuery)

  const visibleIngredients = useMemo(() => {
    const catalog = ingredients.data ?? []
    const needle = ingredientFilter.trim().toLowerCase()
    if (!needle) return catalog
    return catalog.filter((item) => item.toLowerCase().includes(needle))
  }, [ingredients.data, ingredientFilter])

  function selectTab(next: SearchTab) {
    setFormError(null)
    setOverrideTab(next)
    const alreadyShowing =
      (next === 'name' && name && !ingredient && !category) ||
      (next === 'ingredient' && ingredient) ||
      (next === 'category' && category)
    if (!alreadyShowing) setParams({})
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = nameDraft.trim()
    if (!next) {
      setFormError('Enter a drink name to search.')
      return
    }
    setFormError(null)
    setOverrideTab(null)
    setParams({ q: next })
  }

  function submitIngredient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = selectedIngredient || visibleIngredients[0]
    if (!next) {
      setFormError('Choose an ingredient from the list.')
      return
    }
    setFormError(null)
    setOverrideTab(null)
    setParams({ ingredient: next })
  }

  function chooseCategory(next: string) {
    setFormError(null)
    setOverrideTab(null)
    setParams({ category: next })
  }

  const heading = name
    ? `Results for "${name}"`
    : ingredient
      ? `Made with ${ingredient}`
      : category
        ? category
        : 'Search'

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="font-display text-4xl sm:text-5xl">Search the bar</h1>
        <p className="max-w-2xl text-base-content/75">
          Look up a drink by name, filter by one ingredient, or browse a category. Open any result for the full recipe.
        </p>
      </header>

      <div role="tablist" aria-label="Search mode" className="tabs tabs-box w-fit max-w-full">
        <button type="button" role="tab" aria-selected={tab === 'name'} className={`tab ${tab === 'name' ? 'tab-active' : ''}`} onClick={() => selectTab('name')}>
          Name
        </button>
        <button type="button" role="tab" aria-selected={tab === 'ingredient'} className={`tab ${tab === 'ingredient' ? 'tab-active' : ''}`} onClick={() => selectTab('ingredient')}>
          Ingredient
        </button>
        <button type="button" role="tab" aria-selected={tab === 'category'} className={`tab ${tab === 'category' ? 'tab-active' : ''}`} onClick={() => selectTab('category')}>
          Category
        </button>
      </div>

      {tab === 'name' ? (
        <form onSubmit={submitName} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block w-full">
            <span className="mb-1 block text-sm">Drink name</span>
            <input
              className="input input-lg w-full"
              value={nameDraft}
              onChange={(event) => setNameState({ source: name, draft: event.target.value })}
              placeholder="Margarita, negroni, old fashioned…"
              name="q"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-lg">
            Search
          </button>
        </form>
      ) : null}

      {tab === 'ingredient' ? (
        <form onSubmit={submitIngredient} className="space-y-3">
          {ingredients.loading ? <LoadingState label="Loading ingredients…" /> : null}
          {ingredients.error ? <ErrorState message={ingredients.error} onRetry={ingredients.retry} /> : null}
          {ingredients.data ? (
            <>
              <label className="block w-full">
                <span className="mb-1 block text-sm">Filter ingredients</span>
                <input
                  className="input w-full"
                  value={ingredientFilter}
                  onChange={(event) => setIngredientFilter(event.target.value)}
                  placeholder="Gin, lime, coffee…"
                />
              </label>
              <div className="max-h-60 overflow-y-auto rounded-box border border-base-300 bg-base-100">
                {visibleIngredients.length > 0 ? (
                  <ul className="menu w-full" role="listbox" aria-label="Ingredients">
                    {visibleIngredients.map((item) => {
                      const selected = item === selectedIngredient
                      return (
                        <li key={item}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className={selected ? 'bg-primary/15 text-primary' : ''}
                            onClick={() => setPickedIngredient({ source: ingredient, value: item })}
                          >
                            {item}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-6 text-sm text-base-content/70">No ingredients match that filter.</p>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                Show drinks
              </button>
            </>
          ) : null}
        </form>
      ) : null}

      {tab === 'category' ? (
        <div className="space-y-3">
          {categories.loading ? <LoadingState label="Loading categories…" /> : null}
          {categories.error ? <ErrorState message={categories.error} onRetry={categories.retry} /> : null}
          {categories.data ? (
            <ul className="flex flex-wrap gap-2">
              {categories.data.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className={`btn btn-sm ${item === category ? 'btn-primary' : 'btn-outline'}`}
                    aria-pressed={item === category}
                    onClick={() => chooseCategory(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {formError ? (
        <p role="alert" className="text-sm text-error">
          {formError}
        </p>
      ) : null}

      <section aria-live="polite" className="space-y-4">
        {activeQuery ? (
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-3xl">{heading}</h2>
            {results.data && !results.loading ? (
              <p className="text-sm text-base-content/70">
                {results.data.length} {results.data.length === 1 ? 'drink' : 'drinks'}
              </p>
            ) : null}
          </div>
        ) : (
          <EmptyState
            title="Start with a name, an ingredient, or a category."
            detail="Name search and category lists return a page of drinks. The public test key previews one drink per ingredient."
          />
        )}

        {results.loading ? <LoadingState label="Looking up drinks…" /> : null}
        {results.error ? <ErrorState message={results.error} onRetry={results.retry} /> : null}
        {!results.loading && !results.error && activeQuery && results.data && results.data.length === 0 ? (
          <EmptyState title="Nothing matched." detail="Try a shorter name, another ingredient, or a different category." />
        ) : null}
        {!results.loading && results.data && results.data.length > 0 ? <ResultsGrid drinks={results.data} /> : null}
        {!results.loading && ingredient && results.data && results.data.length > 0 && usesTestKey() ? (
          <p className="text-sm text-base-content/70">
            The public test key returns a single preview for ingredient filters. Name and category searches return longer lists.
          </p>
        ) : null}
      </section>
    </div>
  )
}
