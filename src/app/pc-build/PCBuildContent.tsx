'use client'

import React from 'react'
import { Cpu, Check, MonitorPlay, EnvelopeSimple, ChatCircle } from '@phosphor-icons/react'
import { siteConfig } from '@/lib/config'

interface IPCBuild {
  id?: string
  budget_label: string
  budget_min: number
  budget_max: number
  cpu: string
  motherboard: string
  memory: string
  storage: string
  gpu: string
  case_psu: string
  total_price: number
  use_case: string
}

interface PCBuildContentProps {
  builds: IPCBuild[]
}

export const PCBuildContent = ({ builds }: PCBuildContentProps) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Cpu weight="bold" className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              配置单推荐
            </h1>
            <p className="text-text-secondary mt-2">
              实体电脑店亲测配置，从入门到旗舰全覆盖
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {builds.map((build) => (
          <div
            key={build.id || build.budget_label}
            className="card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-sm text-accent font-semibold">
                  💰 {build.budget_label}
                </span>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold text-accent">
                  ¥{build.total_price.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: '处理器', value: build.cpu },
                { label: '主板', value: build.motherboard },
                { label: '内存', value: build.memory },
                { label: '硬盘', value: build.storage },
                { label: '显卡', value: build.gpu },
                { label: '机箱电源', value: build.case_psu },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-overlay"
                >
                  <span className="text-sm text-text-muted">{item.label}</span>
                  <span className="text-sm text-text-primary font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Check weight="bold" className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-secondary">
                  适合 {build.use_case}
                </span>
              </div>
              <a
                href={`mailto:${siteConfig.email}?subject=咨询配置单：${build.budget_label}`}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors glow-hover"
              >
                <MonitorPlay weight="bold" className="w-5 h-5" />
                咨询此配置 / 到店装机
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8 text-center">
        <h3 className="text-xl font-bold text-text-primary mb-3">
          需要定制配置？
        </h3>
        <p className="text-text-secondary mb-6">
          告诉我们你的具体需求和预算，我们为你量身定制最优方案
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-surface-overlay border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-all"
          >
            <EnvelopeSimple weight="bold" className="w-5 h-5" />
            {siteConfig.email}
          </a>
          <span className="flex items-center gap-3 text-sm text-text-muted">
            <ChatCircle weight="bold" className="w-5 h-5" />
            微信：{siteConfig.wechat}
          </span>
        </div>
      </div>
    </div>
  )
}
