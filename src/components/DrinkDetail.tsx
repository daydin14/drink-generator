import { alcoholicClass } from '../lib/drinkStyle'
import { sizedImage } from '../lib/mapDrink'
import type { Drink } from '../types/drink'

interface DrinkDetailProps {
  drink: Drink
}

export function DrinkDetail({ drink }: DrinkDetailProps) {
  const image = sizedImage(drink.image, 'large') ?? drink.image
  const imageAlt = drink.glass ? `${drink.name}, served in a ${drink.glass}` : drink.name

  return (
    <article className="grid items-start gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
      <figure className="overflow-hidden rounded-box bg-base-300 shadow-lg">
        {image ? (
          <img src={image} alt={imageAlt} className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center text-base-content/50">No photo</div>
        )}
      </figure>
      <div className="space-y-6">
        <header className="space-y-3">
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{drink.name}</h1>
          <div className="flex flex-wrap gap-2">
            {drink.category ? <span className="badge badge-outline">{drink.category}</span> : null}
            {drink.alcoholic ? (
              <span className={`badge ${alcoholicClass(drink.alcoholic)}`}>{drink.alcoholic}</span>
            ) : null}
            {drink.glass ? <span className="badge badge-ghost">Glass: {drink.glass}</span> : null}
            {drink.tags.map((tag) => (
              <span key={tag} className="badge badge-soft badge-neutral">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="font-display text-2xl">
            Ingredients
          </h2>
          {drink.ingredients.length > 0 ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {drink.ingredients.map((line, index) => (
                <li
                  key={`${line.name}-${index}`}
                  className="flex items-baseline justify-between gap-3 rounded-field bg-base-100 px-3 py-2"
                >
                  <span>{line.name}</span>
                  {line.measure ? (
                    <span className="text-right text-sm text-base-content/70">{line.measure}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-base-content/70">No ingredients were listed for this drink.</p>
          )}
        </section>

        <section aria-labelledby="instructions-heading">
          <h2 id="instructions-heading" className="font-display text-2xl">
            Instructions
          </h2>
          <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-base-content/90">
            {drink.instructions ?? 'No instructions were listed for this drink.'}
          </p>
        </section>
      </div>
    </article>
  )
}
