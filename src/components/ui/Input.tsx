import React from 'react'
import { cn } from '@/lib/utils'

export interface IInputProps {
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select'
  label?: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  error?: string
  icon?: React.ReactNode
  rows?: number
  maxLength?: number
  options?: { value: string; label: string }[]
}

export const Input = ({
  type = 'text',
  label,
  placeholder,
  required,
  value,
  onChange,
  className,
  disabled,
  error,
  icon,
  rows = 3,
  maxLength,
  options,
}: IInputProps) => {
  const fieldClasses = cn(
    'w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors',
    type === 'textarea' && 'resize-none',
    type === 'select' && 'appearance-none cursor-pointer',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  return (
    <div className="w-full">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
          {icon && <span className="text-on-surface-variant/50">{icon}</span>}
          {label}
          {required && <span className="text-tertiary">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={fieldClasses}
          disabled={disabled}
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClasses}
          disabled={disabled}
        >
          <option value="" className="bg-surface-container">
            请选择
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-container">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={fieldClasses}
          disabled={disabled}
        />
      )}

      {maxLength && type === 'textarea' && (
        <div className="text-right text-xs text-on-surface-variant mt-2">
          {value.length}/{maxLength}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  )
}

export default Input
