import React from 'react'
import { cn } from '@/lib/utils'

export interface IContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
  padding?: 'default' | 'none' | 'mobile-only'
}

export const Container = ({
  children,
  className,
  size = 'default',
  padding = 'default',
}: IContainerProps) => {
  const classes = cn(
    'mx-auto',
    {
      'max-w-max-width px-margin-mobile md:px-margin-desktop':
        size === 'default' && padding !== 'none',
      'max-w-4xl px-margin-mobile md:px-margin-desktop': size === 'narrow',
      'max-w-[1600px] px-margin-mobile md:px-margin-desktop': size === 'wide',
      'px-margin-mobile md:px-margin-desktop': padding === 'mobile-only',
    },
    className
  )

  return <div className={classes}>{children}</div>
}

export default Container
