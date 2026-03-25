export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7'

  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-2 border-sage-200 border-t-sage-400`}
      role="status"
      aria-label="Laden..."
    />
  )
}
