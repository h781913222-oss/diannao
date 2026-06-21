import React from 'react'
import { Metadata } from 'next'
import { BUDGET_TIERS } from '@/constants/index'
import { getPCBuilds } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import { PCBuildContent } from './PCBuildContent'

export const metadata: Metadata = {
  title: `配置单推荐 - ${siteConfig.name}`,
  description: '实体电脑店亲测配置方案，从入门办公到旗舰发烧，满足不同预算需求。',
}

const DEMO_BUILDS = [
  {
    budget_label: '3000以内', budget_min: 0, budget_max: 3000,
    cpu: 'Intel i3-12100F', motherboard: 'H610M 主板',
    memory: '16GB DDR4 3200', storage: '512GB NVMe SSD',
    gpu: '核显 / RX 6400', case_psu: 'MATX机箱 + 400W电源',
    total_price: 2899, use_case: '日常办公、网页浏览、轻度视频',
  },
  {
    budget_label: '5000左右', budget_min: 3000, budget_max: 6000,
    cpu: 'Intel i5-12400F', motherboard: 'B760M 主板',
    memory: '16GB DDR4 3200', storage: '1TB NVMe SSD',
    gpu: 'RTX 3060 12G', case_psu: 'MATX机箱 + 550W电源',
    total_price: 4999, use_case: '1080P游戏、视频剪辑、编程开发',
  },
  {
    budget_label: '8000左右', budget_min: 6000, budget_max: 9000,
    cpu: 'Intel i5-13600KF', motherboard: 'B760M 重炮手',
    memory: '32GB DDR4 3600', storage: '1TB NVMe SSD',
    gpu: 'RTX 4070 12G', case_psu: 'ATX机箱 + 650W金牌',
    total_price: 7999, use_case: '2K高帧游戏、AI绘图、3D渲染',
  },
  {
    budget_label: '10000以上', budget_min: 9000, budget_max: 99999,
    cpu: 'Intel i7-14700KF', motherboard: 'Z790 主板',
    memory: '32GB DDR5 6000', storage: '2TB NVMe SSD',
    gpu: 'RTX 4070 Ti SUPER', case_psu: 'ATX机箱 + 850W金牌',
    total_price: 11999, use_case: '4K游戏、专业创作、直播推流',
  },
]

export default async function PCBuildPage() {
  let builds: Awaited<ReturnType<typeof getPCBuilds>> = []
  try {
    builds = await getPCBuilds()
  } catch (err) {
    console.error('Failed to fetch PC builds:', err)
  }

  if (builds.length === 0) {
    builds = DEMO_BUILDS as any[]
  }

  return <PCBuildContent builds={builds as any} />
}
