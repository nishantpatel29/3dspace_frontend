export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors'
  const styles = variant === 'outline'
    ? 'border-gray-600 text-gray-400'
    : 'border-transparent bg-green-600 text-white'
  return <span className={`${base} ${styles} ${className}`}>{children}</span>
}


