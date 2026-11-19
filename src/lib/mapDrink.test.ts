import { describe, expect, it } from 'vitest'
import { ingredientLines, mapDrink } from './mapDrink'
import type { RawDrink } from '../types/drink'

const margarita: RawDrink = {
  idDrink: '11007',
  strDrink: ' Margarita ',
  strCategory: 'Ordinary Drink',
  strAlcoholic: 'Alcoholic',
  strGlass: 'Cocktail glass',
  strInstructions: ' Rub the rim of the glass with the lime slice. ',
  strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
  strTags: 'IBA,ContemporaryClassic',
  strIngredient1: 'Tequila',
  strMeasure1: '1 1/2 oz ',
  strIngredient2: '  ',
  strMeasure2: '1 oz',
  strIngredient3: 'Lime juice',
  strMeasure3: null,
  strIngredient13: 'Salt',
  strMeasure13: '1 pinch',
}

describe('ingredientLines', () => {
  it('keeps measures, skips blanks, and includes slot 13', () => {
    expect(ingredientLines(margarita)).toEqual([
      { name: 'Tequila', measure: '1 1/2 oz' },
      { name: 'Lime juice', measure: null },
      { name: 'Salt', measure: '1 pinch' },
    ])
  })
})

describe('mapDrink', () => {
  it('trims text fields and splits tags', () => {
    const drink = mapDrink(margarita)
    expect(drink).toMatchObject({
      id: '11007',
      name: 'Margarita',
      category: 'Ordinary Drink',
      alcoholic: 'Alcoholic',
      glass: 'Cocktail glass',
      instructions: 'Rub the rim of the glass with the lime slice.',
      tags: ['IBA', 'ContemporaryClassic'],
    })
    expect(drink.ingredients).toHaveLength(3)
  })
})
