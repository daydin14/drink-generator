import type { Drink, DrinkPreview, IngredientLine, RawDrink } from '../types/drink'

const INGREDIENT_SLOTS = 15

function clean(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function ingredientLines(raw: RawDrink): IngredientLine[] {
  const lines: IngredientLine[] = []

  for (let index = 1; index <= INGREDIENT_SLOTS; index += 1) {
    const name = clean(raw[`strIngredient${index}`])
    if (!name) continue
    lines.push({
      name,
      measure: clean(raw[`strMeasure${index}`]),
    })
  }

  return lines
}

export function mapPreview(raw: RawDrink): DrinkPreview {
  return {
    id: raw.idDrink,
    name: clean(raw.strDrink) ?? 'Untitled drink',
    image: clean(raw.strDrinkThumb),
    category: clean(raw.strCategory),
    alcoholic: clean(raw.strAlcoholic),
    glass: clean(raw.strGlass),
  }
}

export function mapDrink(raw: RawDrink): Drink {
  const tags =
    clean(raw.strTags)
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) ?? []

  return {
    ...mapPreview(raw),
    instructions: clean(raw.strInstructions),
    tags,
    ingredients: ingredientLines(raw),
  }
}

export function sizedImage(url: string | null, size: 'small' | 'medium' | 'large'): string | null {
  if (!url) return null
  return `${url.replace(/\/$/, '')}/${size}`
}
