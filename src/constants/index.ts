import { ICategory } from '@/types/index'

export const CATEGORIES: ICategory[] = [
  { slug: 'software', name: '软件下载', icon: '💾', description: '常用软件、安装教程' },
  { slug: 'github', name: 'GitHub精选', icon: '🐙', description: '优质开源项目推荐' },
  { slug: 'tools', name: '在线工具', icon: '🔧', description: '图片压缩、格式转换等' },
  { slug: 'ai', name: 'AI工具', icon: '🤖', description: 'AI写作、绘图、视频等' },
  { slug: 'hardware', name: '硬件推荐', icon: '🖥️', description: '装机配置、选购指南' },
  { slug: 'system', name: '系统优化', icon: '⚡', description: 'Windows技巧、驱动教程' },
]

export const TAGS = [
  '免费', '免注册', '开源',
  '小白友好', '开发者', '设计师', '办公',
  'AI', '写作', '图片', '视频', '文件', '网络', '编程', '系统', '硬件',
  '编辑推荐', '热门', '新上线'
]

export const BUDGET_TIERS = [
  { label: '3000以内', min: 0, max: 3000, desc: '入门办公' },
  { label: '5000左右', min: 3000, max: 6000, desc: '家用主流' },
  { label: '8000左右', min: 6000, max: 9000, desc: '高性能' },
  { label: '10000以上', min: 9000, max: 99999, desc: '旗舰发烧' },
]

export const TAG_DOT_COLORS: Record<string, string> = {
  '免费': 'tag-dot-green',
  '免注册': 'tag-dot-green',
  '开源': 'tag-dot-green',
  '小白友好': 'tag-dot-blue',
  '开发者': 'tag-dot-purple',
  '设计师': 'tag-dot-purple',
  '办公': 'tag-dot-blue',
  'AI': 'tag-dot-blue',
  '写作': 'tag-dot-yellow',
  '图片': 'tag-dot-yellow',
  '视频': 'tag-dot-yellow',
  '文件': 'tag-dot-yellow',
  '网络': 'tag-dot-yellow',
  '编程': 'tag-dot-purple',
  '系统': 'tag-dot-blue',
  '硬件': 'tag-dot-red',
  '编辑推荐': 'tag-dot-green',
  '热门': 'tag-dot-red',
  '新上线': 'tag-dot-blue',
}

export const SITE_NAME = 'TechVerse'
