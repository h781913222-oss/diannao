import React from 'react'
import { cn } from '@/lib/utils'

const FOOTER_LINKS = [
  { label: 'Github', href: 'https://github.com' },
  { label: 'Discord', href: 'https://discord.com' },
  { label: 'X', href: 'https://x.com' },
  { label: 'Bilibili', href: 'https://bilibili.com' },
]

export const Footer = () => {
  return (
    <footer className="bg-surface w-full py-12 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto gap-gutter-sm">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tighter">
            TechVerse
          </span>
          <span className="font-mono-code text-mono-code text-on-surface-variant text-sm">
            © 2024 TechVerse Inc. Built for the next generation.
          </span>
        </div>

        {/* Links */}
        <nav className="flex gap-6 mt-4 md:mt-0">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'font-mono-code text-mono-code text-on-surface-variant',
                'hover:text-primary transition-colors duration-200'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
