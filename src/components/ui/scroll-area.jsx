export function ScrollArea({ className = '', children }) {
  return (
    <div className={`overflow-auto ${className}`}>
      {children}
    </div>
  )
}


