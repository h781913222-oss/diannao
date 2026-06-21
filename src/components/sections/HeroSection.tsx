'use client'

import React, { useCallback } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ShaderBackground } from './ShaderBackground'
import { ParticleScene, triggerMeteor } from './ParticleScene'

export const HeroSection = () => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    triggerMeteor(e.clientX, e.clientY)
  }, [])

  return (
    <section 
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      onClick={handleClick}
    >
      {/* Background layers */}
      <ShaderBackground />
      <ParticleScene />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 max-w-4xl mx-auto text-center px-margin-mobile md:px-margin-desktop pt-24 pb-16"
      >
        {/* Glass Panel - matching Figma */}
        <div className="rounded-xl p-8 md:p-12 bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 shadow-[0_0_100px_rgba(76,215,246,0.1)]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-on-surface-variant">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary" />
              </span>
              小凯电脑店
            </span>
          </motion.div>

          {/* Main Title - gradient from white to white/40 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-display-xl text-display-mobile md:text-display-xl font-bold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
          >
            TECHVERSE
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed"
          >
            年轻人的数字工具宇宙
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              href="/category/ai"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              [ Explore Universe ]
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/pc-build"
            >
              [ Start Learning ]
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
