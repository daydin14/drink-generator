import { Link } from 'react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <p className="text-sm tracking-[0.18em] text-primary uppercase">404</p>
      <h1 className="font-display text-4xl">This page is not on the menu.</h1>
      <p className="text-base-content/70">Head home, search the cabinet, or pour something at random.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          Home
        </Link>
        <Link to="/search" className="btn btn-outline">
          Search
        </Link>
      </div>
    </div>
  )
}
