import React from 'react'
import { cn } from '@/lib/utils'
import Container from './Container'

export interface ISectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  divider?: 'top' | 'bottom' | 'both' | 'none'
  padding?: 'default' | 'large' | 'hero' | 'none'
  background?: 'default' | 'surface' | 'gradient' | 'transparent'
}

export const Section = ({
  children,
  className,
  id,
  divider = 'none',
  padding = 'default',
  background = 'default',
}: ISectionProps) => {
  const classes = cn(
    {
      'bg-background': background === 'default',
      'bg-surface': background === 'surface',
      'bg-transparent': background === 'transparent',
    },
    {
      'py-24 px-margin-mobile md:px-margin-desktop': padding === 'default',
      'py-32 px-margin-mobile md:px-margin-desktop': padding === 'large',
      'min-h-screen flex items-center justify-center pt-24 pb-16 px-margin-mobile md:px-margin-desktop':
        padding === 'hero',
      '': padding === 'none',
    },
    {
      'border-t border-white/5': divider === 'top' || divider === 'both',
      'border-b border-white/5': divider === 'bottom' || divider === 'both',
    },
    className
  )

  if (padding === 'hero') {
    return (
      <section id={id} className={classes}>
        {children}
      </section>
    )
  }

  return (
    <section id={id} className={classes}>
      <Container>{children}</Container>
    </section>
  )
}

export default Section
