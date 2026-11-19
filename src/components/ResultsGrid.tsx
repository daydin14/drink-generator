import { DrinkCard } from './DrinkCard'
import type { DrinkPreview } from '../types/drink'

interface ResultsGridProps {
  drinks: DrinkPreview[]
}

export function ResultsGrid({ drinks }: ResultsGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {drinks.map((drink) => (
        <DrinkCard key={drink.id} drink={drink} />
      ))}
    </ul>
  )
}
