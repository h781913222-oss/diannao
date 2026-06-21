import React from 'react'
import { cn } from '@/lib/utils'

export interface ITabItem {
  id: string
  label: string
  description?: string
  content: React.ReactNode
}

export interface ITabsProps {
  items: ITabItem[]
  defaultActiveId?: string
  onChange?: (id: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Tabs = ({
  items,
  defaultActiveId,
  onChange,
  orientation = 'horizontal',
  className,
}: ITabsProps) => {
  const [activeId, setActiveId] = React.useState(
    defaultActiveId || items[0]?.id
  )

  const handleChange = (id: string) => {
    setActiveId(id)
    onChange?.(id)
  }

  const activeItem = items.find((item) => item.id === activeId)

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleChange(item.id)}
            className={cn(
              'w-full text-left p-5 rounded-xl border transition-all duration-200',
              activeId === item.id
                ? 'bg-tertiary/10 border-tertiary/30'
                : 'glass-panel hover:bg-white/5 hover:border-white/15'
            )}
          >
            <div
              className={cn(
                'font-semibold text-base',
                activeId === item.id ? 'text-tertiary' : 'text-on-surface'
              )}
            >
              {item.label}
            </div>
            {item.description && (
              <div className="text-sm text-on-surface-variant mt-1">
                {item.description}
              </div>
            )}
          </button>
        ))}
        {activeItem && (
          <div className="mt-6">{activeItem.content}</div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleChange(item.id)}
            className={cn(
              'px-4 py-2 rounded-full font-label-sm transition-all duration-200 whitespace-nowrap',
              activeId === item.id
                ? 'bg-white/10 text-on-surface border border-white/20'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div className="mt-6">{activeItem.content}</div>
      )}
    </div>
  )
}

export default Tabs
