'use client'

import React from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { ITool } from '@/types/index'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface ITrendingTodayProps {
  tools: ITool[]
}

const CATEGORY_LABEL: Record<string, string> = {
  software: 'Software',
  github: 'GitHub',
  tools: 'Tool',
  ai: 'AI Tool',
  hardware: 'Hardware',
  system: 'System',
}

export const TrendingToday = ({ tools }: ITrendingTodayProps) => {
  const displayTools = tools.slice(0, 5)

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop border-t border-white/5">
      <div className="max-w-max-width mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h2 className="font-display-lg text-display-mobile md:text-display-lg text-on-surface font-bold tracking-tight">
            Trending Today
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
            每周精选热门工具和软件，发现当下最实用的数字资源
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-tertiary to-transparent mt-4 rounded-full" />
        </motion.div>

        {/* Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop">
          {displayTools.map((tool, index) => (
            <motion.a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                'min-w-[300px] md:min-w-[400px] glass-panel rounded-xl p-6 flex flex-col gap-4 snap-start border-l-2 border-l-tertiary',
                'glass-panel-interactive hover:border-l-secondary transition-all duration-300'
              )}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <Badge variant="category">
                  #{index + 1} {CATEGORY_LABEL[tool.category] || 'Tool'}
                </Badge>
                <ArrowUpRight className="w-4 h-4 text-on-surface-variant" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className="font-headline-md text-headline-md text-white">
                  {tool.name}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1 line-clamp-2">
                  {tool.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                {tool.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingToday
