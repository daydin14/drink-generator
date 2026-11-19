interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading drinks…' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/70">{label}</p>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="alert alert-soft alert-error items-start sm:items-center">
      <span className="flex-1">{message}</span>
      {onRetry ? (
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  detail?: string
}

export function EmptyState({ title, detail }: EmptyStateProps) {
  return (
    <div className="rounded-box border border-dashed border-base-300 bg-base-100/80 px-6 py-12 text-center">
      <h2 className="font-display text-2xl">{title}</h2>
      {detail ? <p className="mx-auto mt-2 max-w-md text-base-content/70">{detail}</p> : null}
    </div>
  )
}
