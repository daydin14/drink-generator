import { Link } from 'react-router'
import { alcoholicClass } from '../lib/drinkStyle'
import { sizedImage } from '../lib/mapDrink'
import type { DrinkPreview } from '../types/drink'

interface DrinkCardProps {
  drink: DrinkPreview
}

export function DrinkCard({ drink }: DrinkCardProps) {
  const image = sizedImage(drink.image, 'medium')

  return (
    <li>
      <Link
        to={`/drink/${drink.id}`}
        className="card h-full bg-base-100 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <figure className="aspect-square overflow-hidden bg-base-300">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="text-sm text-base-content/50">No photo</span>
          )}
        </figure>
        <div className="card-body gap-2 p-4">
          <h3 className="card-title text-base leading-snug">{drink.name}</h3>
          {drink.category || drink.alcoholic ? (
            <div className="flex flex-wrap gap-1.5">
              {drink.category ? <span className="badge badge-sm badge-outline">{drink.category}</span> : null}
              {drink.alcoholic ? (
                <span className={`badge badge-sm ${alcoholicClass(drink.alcoholic)}`}>{drink.alcoholic}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    </li>
  )
}
