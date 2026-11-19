import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Search', end: false },
  { to: '/random', label: 'Random', end: false },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return `btn btn-ghost btn-sm ${isActive ? 'btn-active' : ''}`
}

export function Layout() {
  const year = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:btn focus:btn-sm focus:btn-primary"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-base-300/80 bg-base-100/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink to="/" end className="group flex items-center gap-2">
            <GlassMark />
            <span className="font-display text-xl leading-none tracking-tight sm:text-2xl">
              Dave's <span className="text-primary">Drink</span> Generator
            </span>
          </NavLink>
          <nav aria-label="Primary" className="flex gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-base-300/80 bg-base-100/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-base-content/70 sm:flex-row sm:items-center">
          <p>
            Created by{' '}
            <a
              className="link link-hover text-primary"
              href="https://www.linkedin.com/in/daydin14/"
              target="_blank"
              rel="noreferrer noopener"
            >
              David Aydin
            </a>{' '}
            © {year}
          </p>
          <p>
            Drink data from{' '}
            <a
              className="link link-hover"
              href="https://www.thecocktaildb.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              TheCocktailDB
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

function GlassMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 text-primary">
      <path
        d="M6 6h20l-1.4 8.2a8.6 8.6 0 0 1-17.2 0L6 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M16 22.5V27M11.5 27h9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
