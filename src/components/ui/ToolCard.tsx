'use client'

import React from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { ITool } from '@/types/index'
import { TagBadge } from './TagBadge'
import { getFaviconUrl } from '@/lib/utils'

interface IToolCardProps {
  tool: ITool
  index?: number
}

export const ToolCard = ({ tool, index = 0 }: IToolCardProps) => {
  const faviconUrl = tool.icon_url || getFaviconUrl(tool.url)

  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card gradient-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -4 }}
    >
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-surface-overlay flex items-center justify-center flex-shrink-0 overflow-hidden border border-border group-hover:border-border-hover transition-colors">
            <img
              src={faviconUrl}
              alt=""
              className="w-6 h-6 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLDivElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div className="hidden w-full h-full items-center justify-center text-sm font-bold text-text-muted">
              {tool.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-text-primary group-hover:text-accent transition-colors truncate">
                {tool.name}
              </h3>
              <ArrowUpRight 
                weight="bold"
                className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" 
              />
            </div>
            <p className="text-sm text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {tool.tags?.slice(0, 3).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

export default ToolCard
