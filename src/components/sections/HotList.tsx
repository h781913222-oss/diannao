'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight, TrendUp, Flame } from '@phosphor-icons/react'
import { ITool } from '@/types/index'
import { getFaviconUrl } from '@/lib/utils'

interface IHotListProps {
  tools: ITool[]
}

export const HotList = ({ tools }: IHotListProps) => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flame weight="fill" className="w-6 h-6 text-orange-500" />
              <h2 className="text-3xl font-bold text-text-primary">今日热榜</h2>
            </div>
            <p className="text-text-secondary">每周精选热门工具</p>
          </div>
          <Link
            href="/category/software"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-overlay border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
          >
            查看全部
            <TrendUp weight="bold" className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {tools.slice(0, 5).map((tool, index) => (
            <motion.a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ x: 4 }}
            >
              <div className="relative z-10 flex items-center gap-4 p-5">
                <span className={`font-mono text-lg font-bold w-8 ${
                  index < 3 ? 'text-accent' : 'text-text-muted'
                }`}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="w-12 h-12 rounded-xl bg-surface-overlay flex items-center justify-center flex-shrink-0 overflow-hidden border border-border">
                  <img
                    src={tool.icon_url || getFaviconUrl(tool.url)}
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
                </div>

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
                  <p className="text-sm text-text-secondary truncate mt-1">
                    {tool.description}
                  </p>
                </div>

                <span className="hidden sm:block px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted bg-surface-overlay border border-border">
                  {tool.category === 'software' && '软件'}
                  {tool.category === 'github' && 'GitHub'}
                  {tool.category === 'tools' && '工具'}
                  {tool.category === 'ai' && 'AI'}
                  {tool.category === 'hardware' && '硬件'}
                  {tool.category === 'system' && '系统'}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HotList
