interface GridProps {
  children: React.ReactNode
  className?: string
}

export function Grid({ children, className = '' }: GridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {children}
    </div>
  )
}
