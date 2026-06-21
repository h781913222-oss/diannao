import React from 'react'
import { cn } from '@/lib/utils'

export interface ICardProps {
  variant?: 'default' | 'interactive' | 'trending' | 'horizontal'
  children: React.ReactNode
  className?: string
  href?: string
  as?: React.ElementType
  glowColor?: 'tertiary' | 'secondary' | 'none'
  leftBorder?: 'tertiary' | 'secondary' | 'none'
  shimmer?: boolean
}

export const Card = ({
  variant = 'default',
  children,
  className,
  href,
  as: Component = href ? 'a' : 'div',
  glowColor = 'none',
  leftBorder = 'none',
  shimmer = false,
}: ICardProps) => {
  const baseClasses = 'glass-panel overflow-hidden'

  const variantClasses = {
    default: 'rounded-xl p-6',
    interactive: 'glass-panel-interactive rounded-xl p-6 flex flex-col justify-between relative',
    trending:
      'min-w-[300px] md:min-w-[400px] rounded-xl p-6 flex flex-col gap-4 snap-start',
    horizontal: 'glass-panel-interactive rounded-xl',
  }

  const borderClasses = {
    'tertiary': 'border-l-2 border-l-tertiary',
    'secondary': 'border-l-2 border-l-secondary',
    'none': '',
  }

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    borderClasses[leftBorder],
    shimmer && 'animate-shimmer',
    className
  )

  return (
    <Component href={href} className={classes}>
      {glowColor !== 'none' && variant === 'interactive' && (
        <div
          className={cn(
            'absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            glowColor === 'tertiary' && 'bg-tertiary/10',
            glowColor === 'secondary' && 'bg-secondary/10'
          )}
        />
      )}
      <div className="relative z-10">{children}</div>
    </Component>
  )
}

export default Card
