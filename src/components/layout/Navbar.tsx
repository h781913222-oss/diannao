'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Discover' },
  { href: '/category/ai', label: 'Universe' },
  { href: '/submit', label: 'Creators' },
  { href: '/pc-build', label: 'Market' },
]

const Navbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-surface/30 backdrop-blur-xl border-b border-white/10',
        scrolled && 'bg-surface/50'
      )}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-max-width mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="font-display-lg text-display-mobile md:text-display-lg tracking-tighter text-on-surface hover:opacity-80 transition-opacity"
        >
          {siteConfig.name}
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-8 items-center" aria-label="主导航">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors duration-300',
                isActive(link.href)
                  ? 'text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            type="button"
            className={cn(
              'flex items-center justify-center p-2 rounded-full',
              'text-on-surface hover:text-primary hover:bg-white/5 transition-colors'
            )}
            aria-label="通知"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Get Started */}
          <Link
            href="/submit"
            className={cn(
              'hidden md:flex items-center gap-2',
              'bg-white/5 border border-white/10 text-on-surface',
              'px-6 py-2 rounded-full font-label-sm',
              'hover:bg-white/10 hover:border-white/20 transition-all raycast-focus'
            )}
          >
            Get Started
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden flex items-center justify-center p-2',
              'text-on-surface hover:text-primary hover:bg-white/5 transition-colors'
            )}
            aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-margin-mobile pb-4"
          >
            <div className="glass-panel rounded-xl p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-on-surface bg-white/5'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  )}
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
