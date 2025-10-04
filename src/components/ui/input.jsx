export function Input(props) {
  const { className = '', ...rest } = props
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-gray-700 bg-transparent px-3 py-1 text-sm text-white shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...rest}
    />
  )
}


