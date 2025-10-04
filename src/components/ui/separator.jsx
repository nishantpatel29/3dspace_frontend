export function Separator({ orientation = 'horizontal', className = '' }) {
  const base = orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full'
  return <div className={`${base} bg-gray-800 ${className}`} />
}


