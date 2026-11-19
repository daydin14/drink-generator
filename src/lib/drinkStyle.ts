export function alcoholicClass(value: string): string {
  const normalized = value.toLowerCase()
  if (normalized.includes('non')) return 'badge-success'
  if (normalized.includes('optional')) return 'badge-info'
  return 'badge-secondary'
}
