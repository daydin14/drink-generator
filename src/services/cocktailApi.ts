import { mapDrink, mapPreview } from '../lib/mapDrink'
import type { Drink, DrinkPreview, RawDrink } from '../types/drink'

const API_ROOT = 'https://www.thecocktaildb.com/api/json/v1'
export const TEST_API_KEY = '1'

export class CocktailApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CocktailApiError'
  }
}

export function apiKey(): string {
  const configured = import.meta.env.VITE_COCKTAILDB_KEY?.trim()
  return configured ? configured : TEST_API_KEY
}

export function usesTestKey(): boolean {
  return apiKey() === TEST_API_KEY
}

export function cocktailUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${API_ROOT}/${encodeURIComponent(apiKey())}/${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

interface DrinksResponse<T> {
  drinks: T[] | null
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

async function request<T>(
  path: string,
  params: Record<string, string> | undefined,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(cocktailUrl(path, params), {
      signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new CocktailApiError('Could not reach TheCocktailDB. Check your connection and try again.')
  }

  if (!response.ok) {
    throw new CocktailApiError(`TheCocktailDB responded with status ${response.status}. Please try again.`)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new CocktailApiError('TheCocktailDB returned a response that was not valid JSON.')
  }
}

function rowsOf<T>(payload: DrinksResponse<T>): T[] {
  return payload.drinks ?? []
}

const listCache = new Map<string, Promise<string[]>>()

function cachedList(key: string, loader: () => Promise<string[]>): Promise<string[]> {
  const existing = listCache.get(key)
  if (existing) return existing

  const pending = loader().catch((error: unknown) => {
    listCache.delete(key)
    throw error
  })
  listCache.set(key, pending)
  return pending
}

export const cocktailApi = {
  async random(signal?: AbortSignal): Promise<Drink | null> {
    const payload = await request<DrinksResponse<RawDrink>>('random.php', undefined, signal)
    const raw = rowsOf(payload)[0]
    return raw ? mapDrink(raw) : null
  },

  async searchByName(name: string, signal?: AbortSignal): Promise<Drink[]> {
    const query = name.trim()
    if (!query) return []
    const payload = await request<DrinksResponse<RawDrink>>('search.php', { s: query }, signal)
    return rowsOf(payload).map(mapDrink)
  },

  async filterByIngredient(ingredient: string, signal?: AbortSignal): Promise<DrinkPreview[]> {
    const query = ingredient.trim()
    if (!query) return []
    const payload = await request<DrinksResponse<RawDrink>>('filter.php', { i: query }, signal)
    return rowsOf(payload).map(mapPreview)
  },

  async filterByCategory(category: string, signal?: AbortSignal): Promise<DrinkPreview[]> {
    const query = category.trim()
    if (!query) return []
    const payload = await request<DrinksResponse<RawDrink>>('filter.php', { c: query }, signal)
    return rowsOf(payload).map(mapPreview)
  },

  async lookup(id: string, signal?: AbortSignal): Promise<Drink | null> {
    const query = id.trim()
    if (!query) return null
    const payload = await request<DrinksResponse<RawDrink>>('lookup.php', { i: query }, signal)
    const raw = rowsOf(payload)[0]
    return raw ? mapDrink(raw) : null
  },

  listCategories(): Promise<string[]> {
    return cachedList('categories', async () => {
      const payload = await request<DrinksResponse<{ strCategory: string }>>('list.php', { c: 'list' })
      return rowsOf(payload)
        .map((row) => row.strCategory)
        .filter((name) => name.trim().length > 0)
    })
  },

  listIngredients(): Promise<string[]> {
    return cachedList('ingredients', async () => {
      const payload = await request<DrinksResponse<{ strIngredient1: string }>>('list.php', { i: 'list' })
      return rowsOf(payload)
        .map((row) => row.strIngredient1)
        .filter((name) => name.trim().length > 0)
        .sort((a, b) => a.localeCompare(b))
    })
  },
}
