export function Checkbox({ id, checked, onCheckedChange, className = '' }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`h-4 w-4 rounded border border-gray-600 bg-gray-800 text-green-600 focus:ring-green-400 ${className}`}
    />
  )
}


