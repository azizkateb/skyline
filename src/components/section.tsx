import { forwardRef } from 'react'

const spacingMap = {
  24: 'py-6',
  40: 'py-8 md:py-10',
  64: 'py-10 md:py-16',
  96: 'py-16 md:py-24',
  120: 'py-16 md:py-[7.5rem]',
  160: 'py-20 md:py-40',
} as const

type SectionSpacing = keyof typeof spacingMap

interface SectionProps {
  children: React.ReactNode
  spacing?: SectionSpacing
  className?: string
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, spacing = 96, className = '' }, ref) => {
    return (
      <section ref={ref} className={`${spacingMap[spacing]} ${className}`}>
        {children}
      </section>
    )
  }
)
Section.displayName = 'Section'
