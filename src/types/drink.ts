export interface IngredientLine {
  name: string
  measure: string | null
}

export interface DrinkPreview {
  id: string
  name: string
  image: string | null
  category: string | null
  alcoholic: string | null
  glass: string | null
}

export interface Drink extends DrinkPreview {
  instructions: string | null
  tags: string[]
  ingredients: IngredientLine[]
}

export interface RawDrink {
  idDrink: string
  strDrink?: string | null
  strDrinkThumb?: string | null
  strCategory?: string | null
  strAlcoholic?: string | null
  strGlass?: string | null
  strInstructions?: string | null
  strTags?: string | null
  [field: string]: string | null | undefined
}
