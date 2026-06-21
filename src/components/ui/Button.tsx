import React from 'react'
import { cn } from '@/lib/utils'

export interface IButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className,
  disabled,
  onClick,
  icon,
  iconPosition = 'right',
}: IButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center font-label-sm transition-all duration-300 raycast-focus'

  const variantClasses = {
    primary:
      'group relative bg-transparent border border-white text-white overflow-hidden hover:border-tertiary',
    secondary:
      'bg-white/5 border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 backdrop-blur-md',
    ghost:
      'text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-medium',
    outline:
      'hidden md:flex bg-white/5 border border-white/10 text-on-surface hover:bg-white/10 hover:border-white/20',
    danger:
      'bg-transparent border border-error text-error hover:bg-error/10',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 rounded-full text-label-sm',
    md: 'px-6 py-3 rounded-full text-label-sm',
    lg: 'px-8 py-4 rounded-full text-label-sm',
  }

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  )

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && iconPosition === 'right' && (
          <span className="group-hover:translate-x-1 transition-transform">
            {icon}
          </span>
        )}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}

export default Button
