import { describe, expect, it } from 'vitest'
import { cocktailUrl } from './cocktailApi'

describe('cocktailUrl', () => {
  it('calls the public test key when no env key is set', () => {
    const url = new URL(cocktailUrl('random.php'))
    expect(url.origin + url.pathname).toBe('https://www.thecocktaildb.com/api/json/v1/1/random.php')
  })

  it('places search and filter parameters on the documented endpoints', () => {
    const search = new URL(cocktailUrl('search.php', { s: 'gin fizz' }))
    expect(search.pathname.endsWith('/search.php')).toBe(true)
    expect(search.searchParams.get('s')).toBe('gin fizz')

    const ingredient = new URL(cocktailUrl('filter.php', { i: 'Light rum' }))
    expect(ingredient.pathname.endsWith('/filter.php')).toBe(true)
    expect(ingredient.searchParams.get('i')).toBe('Light rum')

    const lookup = new URL(cocktailUrl('lookup.php', { i: '11007' }))
    expect(lookup.pathname.endsWith('/lookup.php')).toBe(true)
    expect(lookup.searchParams.get('i')).toBe('11007')
  })
})
