'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Cpu, Check, ArrowRight, Sparkle } from '@phosphor-icons/react'
import { BUDGET_TIERS } from '@/constants/index'

interface IPCBuildDemo {
  budget: string
  cpu: string
  motherboard: string
  memory: string
  storage: string
  gpu: string
  case_psu: string
  price: number
  features: string[]
}

const DEMO_BUILDS: IPCBuildDemo[] = [
  {
    budget: '3000以内',
    cpu: 'Intel i3-12100F',
    motherboard: 'H610M 主板',
    memory: '16GB DDR4 3200',
    storage: '512GB NVMe SSD',
    gpu: '核显 / RX 6400',
    case_psu: 'MATX机箱 + 400W电源',
    price: 2899,
    features: ['日常办公', '网页浏览', '轻度视频'],
  },
  {
    budget: '5000左右',
    cpu: 'Intel i5-12400F',
    motherboard: 'B760M 主板',
    memory: '16GB DDR4 3200',
    storage: '1TB NVMe SSD',
    gpu: 'RTX 3060 12G',
    case_psu: 'MATX机箱 + 550W电源',
    price: 4999,
    features: ['1080P游戏', '视频剪辑', '编程开发'],
  },
  {
    budget: '8000左右',
    cpu: 'Intel i5-13600KF',
    motherboard: 'B760M 重炮手',
    memory: '32GB DDR4 3600',
    storage: '1TB NVMe SSD',
    gpu: 'RTX 4070 12G',
    case_psu: 'ATX机箱 + 650W金牌',
    price: 7999,
    features: ['2K高帧游戏', 'AI绘图', '3D渲染'],
  },
  {
    budget: '10000以上',
    cpu: 'Intel i7-14700KF',
    motherboard: 'Z790 主板',
    memory: '32GB DDR5 6000',
    storage: '2TB NVMe SSD',
    gpu: 'RTX 4070 Ti SUPER',
    case_psu: 'ATX机箱 + 850W金牌',
    price: 11999,
    features: ['4K游戏', '专业创作', '直播推流'],
  },
]

export const PcBuildSelector = () => {
  const [selectedBudget, setSelectedBudget] = useState(1)
  const build = DEMO_BUILDS[selectedBudget]

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Cpu weight="bold" className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-bold text-text-primary">配置单推荐</h2>
          </div>
          <p className="text-text-secondary">实体电脑店亲测配置</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget selector */}
          <div className="lg:col-span-1 space-y-3">
            {BUDGET_TIERS.map((tier, index) => (
              <motion.button
                key={tier.label}
                onClick={() => setSelectedBudget(index)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                  selectedBudget === index
                    ? 'bg-accent/10 border-accent/30'
                    : 'bg-surface-elevated border-border hover:bg-surface-overlay hover:border-border-hover'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`font-semibold text-base ${
                  selectedBudget === index ? 'text-accent' : 'text-text-primary'
                }`}>
                  {tier.label}
                </div>
                <div className="text-sm text-text-secondary mt-1">
                  {tier.desc}
                </div>
              </motion.button>
            ))}

            <Link
              href="/pc-build"
              className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-surface-elevated border border-border text-sm text-text-secondary hover:text-text-primary hover:bg-surface-overlay hover:border-border-hover transition-all"
            >
              查看全部配置方案
              <ArrowRight weight="bold" className="w-4 h-4" />
            </Link>
          </div>

          {/* Build details */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBudget}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="card p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">
                      {build.budget} 配置方案
                    </h3>
                    <p className="text-text-secondary mt-2">
                      适合 {build.features.join('、')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-3xl font-bold text-accent">
                      ¥{build.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-text-muted">参考总价</div>
                  </div>
                </div>

                <div className="space-y-4">
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

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-wrap gap-3">
                    {build.features.map((feature) => (
                      <span
                        key={feature}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-sm text-accent font-medium"
                      >
                        <Check weight="bold" className="w-4 h-4" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-accent text-white font-semibold text-base hover:bg-accent-hover transition-colors glow-hover"
                  >
                    <Sparkle weight="bold" className="w-5 h-5" />
                    咨询装机 / 到店体验
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PcBuildSelector
