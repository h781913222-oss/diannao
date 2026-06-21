'use client'

import React from 'react'
import { TAG_DOT_COLORS } from '@/constants/index'

interface ITagBadgeProps {
  tag: string
  size?: 'sm' | 'md'
}

export const TagBadge = ({ tag, size = 'md' }: ITagBadgeProps) => {
  const dotColor = TAG_DOT_COLORS[tag] || 'tag-dot-blue'
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5'

  return (
    <span className={`inline-flex items-center rounded-full bg-surface-overlay border border-border text-text-secondary font-medium ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {tag}
    </span>
  )
}

export default TagBadge
