'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Rocket,
  Code,
  Wrench,
  Bot,
  Monitor,
  Zap,
  Mail,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { CATEGORIES } from '@/constants/index'
import { cn } from '@/lib/utils'

// Map categories to icons and sizes
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; size: 'large' | 'normal' }> = {
  ai: { icon: <Bot className="w-6 h-6" />, size: 'large' },
  github: { icon: <Code className="w-5 h-5" />, size: 'normal' },
  software: { icon: <Rocket className="w-5 h-5" />, size: 'normal' },
  tools: { icon: <Wrench className="w-5 h-5" />, size: 'normal' },
  hardware: { icon: <Monitor className="w-5 h-5" />, size: 'normal' },
  system: { icon: <Zap className="w-5 h-5" />, size: 'normal' },
}

// Extra cards (not in CATEGORIES)
const EXTRA_CARDS = [
  {
    id: 'contact',
    name: 'Contact',
    description: 'Get in touch with us.',
    icon: <Mail className="w-5 h-5" />,
    href: '/contact',
    size: 'normal' as const,
  },
  {
    id: 'get-started',
    name: 'Get Started',
    description: 'Submit your tool to TechVerse.',
    icon: <ArrowRight className="w-5 h-5" />,
    href: '/submit',
    size: 'normal' as const,
  },
]

export const BentoGrid = () => {
  const allCards = [
    ...CATEGORIES.map((cat) => {
      const config = CATEGORY_CONFIG[cat.slug]
      return {
        id: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: config?.icon || <ArrowUpRight className="w-5 h-5" />,
        href: `/category/${cat.slug}`,
        size: config?.size || 'normal',
      }
    }),
    ...EXTRA_CARDS,
  ]

  return (
    <section id="explore-universe" className="py-24 px-margin-mobile md:px-margin-desktop">
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
            Explore Universe
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-tertiary to-transparent mt-4 rounded-full" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          {allCards.map((card, index) => {
            const isLarge = card.size === 'large'
            const Icon = card.icon

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  isLarge
                    ? 'col-span-1 md:col-span-2 row-span-2'
                    : 'col-span-1 row-span-1'
                )}
              >
                <Link
                  href={card.href}
                  className={cn(
                    'glass-panel glass-panel-interactive rounded-xl p-6 flex flex-col justify-between h-full relative overflow-hidden group',
                    isLarge && 'p-8'
                  )}
                >
                  {/* Decorative glow for large card */}
                  {isLarge && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors duration-500" />
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        'text-on-surface',
                        isLarge && 'text-xl'
                      )}>
                        {Icon}
                      </span>
                      <h3 className={cn(
                        'font-label-sm text-label-sm text-white font-medium uppercase tracking-wider',
                        isLarge && 'text-headline-md font-headline-md'
                      )}>
                        {card.name}
                      </h3>
                    </div>
                    <p className={cn(
                      'font-body-md text-body-md text-on-surface-variant mt-2',
                      isLarge && 'text-body-lg'
                    )}>
                      {card.description}
                    </p>
                  </div>

                  <div className="relative z-10 self-end mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-on-surface-variant" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BentoGrid
