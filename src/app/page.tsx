import React from 'react'
import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { BentoGrid } from '@/components/sections/BentoGrid'
import { TrendingToday } from '@/components/sections/TrendingToday'
import { PcBuildSelector } from '@/components/sections/PcBuildSelector'
import { Section } from '@/components/ui/Section'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { siteConfig } from '@/lib/config'
import { getHotTools, getNewTools, getFeaturedTools } from '@/lib/queries'

export const metadata: Metadata = {
  title: `${siteConfig.name}`,
  description: siteConfig.description,
}

export default async function HomePage() {
  let hotTools: Awaited<ReturnType<typeof getHotTools>> = []
  let newTools: Awaited<ReturnType<typeof getNewTools>> = []
  let featuredTools: Awaited<ReturnType<typeof getFeaturedTools>> = []

  try {
    [hotTools, newTools, featuredTools] = await Promise.all([
      getHotTools(),
      getNewTools(),
      getFeaturedTools(),
    ])
  } catch (err) {
    console.error('Failed to fetch tools:', err)
  }

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Explore Universe */}
      <BentoGrid />

      {/* Trending Today */}
      <TrendingToday tools={hotTools} />

      {/* Featured Tools & New Tools - placeholder for next phase */}
      {featuredTools.length > 0 && (
        <Section divider="top">
          <SectionTitle
            title="Featured Tools"
            subtitle="实体电脑店亲测好用，持续更新的精选推荐"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.slice(0, 6).map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel glass-panel-interactive rounded-xl p-6 block"
              >
                <h3 className="font-headline-md text-headline-md text-white">{tool.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                  {tool.description}
                </p>
              </a>
            ))}
          </div>
        </Section>
      )}

      {newTools.length > 0 && (
        <Section divider="top">
          <SectionTitle
            title="New Arrivals"
            subtitle="最近发现的好工具，新鲜上架"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newTools.slice(0, 6).map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel glass-panel-interactive rounded-xl p-6 block"
              >
                <h3 className="font-headline-md text-headline-md text-white">{tool.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                  {tool.description}
                </p>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* PC Build */}
      <Section divider="top">
        <PcBuildSelector />
      </Section>
    </div>
  )
}
