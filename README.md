# Dave's Drink Generator

Search cocktails, filter by what is in the cabinet, and pour a drink at random. Recipes come from [TheCocktailDB](https://www.thecocktaildb.com/api.php): name, photo, category, alcoholic or not, glass, ingredients with measures, and instructions.

## Features

- Random drink from `random.php`, with a button to pour another
- Search by name via `search.php?s=`
- Filter by ingredient via `filter.php?i=`
- Browse categories from `list.php?c=list`, then `filter.php?c=`
- Ingredient list from `list.php?i=list`
- Full recipe by id via `lookup.php?i=`
- Loading and error states for every request
- Responsive layout built with Tailwind CSS 4 and daisyUI 5

The public test key `1` is used unless you set `VITE_COCKTAILDB_KEY`. That key is for development: ingredient filters return a single preview drink, and some lists are capped. Name search and category browse return longer lists.

## Setup

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:5173/drink-generator/](http://localhost:5173/drink-generator/). The dev server redirects `/` to that path. The `/drink-generator/` base matches this repo’s GitHub Pages project URL.

To use your own key locally, copy the example env file and fill it in. Do not commit `.env`.

```bash
cp .env.example .env
```

`VITE_` variables are compiled into the static site. A premium key in a public GitHub Pages build would be visible to visitors, so leave the test key in place for the public deploy.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck, build `dist/`, and add `404.html` for client-side routes |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## GitHub Pages

The site is a static Vite build. [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publishes `dist/` to GitHub Pages on every push to `main`.

One-time setup in the repository settings:

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.

The published URL is `https://daydin14.github.io/drink-generator/`. Direct links such as `/drink-generator/drink/11007` work because the build copies `index.html` to `404.html`, which GitHub Pages serves for unknown paths.

Source: [github.com/daydin14/drink-generator](https://github.com/daydin14/drink-generator).

Pull requests run lint, tests, and the production build in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Project layout

```
src/services/cocktailApi.ts   typed TheCocktailDB client
src/lib/mapDrink.ts           ingredient and drink mapping
src/hooks/useAsync.ts         loading, error, and retry state
src/pages                    Home, Search, Random, and drink details
```
