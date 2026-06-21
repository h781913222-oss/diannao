import React from 'react'
import { cn } from '@/lib/utils'

export interface ISectionTitleProps {
  title: React.ReactNode
  subtitle?: string
  badge?: string
  align?: 'left' | 'center' | 'right'
  action?: React.ReactNode
  className?: string
}

export const SectionTitle = ({
  title,
  subtitle,
  badge,
  align = 'left',
  action,
  className,
}: ISectionTitleProps) => {
  return (
    <div
      className={cn(
        'flex flex-col mb-12 relative',
        align === 'center' && 'items-center text-center',
        align === 'right' && 'items-end text-right',
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-on-surface-variant mb-4">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          {badge}
        </span>
      )}

      <h2
        className={cn(
          'font-display-lg text-display-mobile md:text-display-lg text-on-surface font-bold tracking-tight',
          typeof title === 'string' && title.includes('gradient') && 'text-gradient'
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
          {subtitle}
        </p>
      )}

      <div className="h-1 w-24 bg-gradient-to-r from-tertiary to-transparent mt-4 rounded-full" />

      {action && (
        <div className="mt-6 md:mt-0 md:absolute md:right-0 md:top-0">
          {action}
        </div>
      )}
    </div>
  )
}

export default SectionTitle
