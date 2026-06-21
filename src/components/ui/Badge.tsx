import React from 'react'
import { cn } from '@/lib/utils'

export interface IBadgeProps {
  variant?: 'default' | 'category' | 'rank' | 'feature' | 'tag' | 'live'
  children: React.ReactNode
  className?: string
}

export const Badge = ({ variant = 'default', children, className }: IBadgeProps) => {
  const classes = cn(
    'inline-flex items-center',
    {
      default: 'px-2 py-1 bg-white/5 rounded-full text-xs font-mono-code text-on-surface-variant',
      category: 'bg-surface-variant px-2 py-1 rounded text-xs font-mono-code text-tertiary',
      rank: 'font-mono text-lg font-bold w-8 text-tertiary',
      feature: 'flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary/10 text-sm text-tertiary font-medium',
      tag: 'px-2 py-1 bg-white/5 rounded-full text-xs font-mono-code text-on-surface-variant',
      live: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-on-surface-variant',
    }[variant],
    className
  )

  return <span className={classes}>{children}</span>
}

export default Badge
