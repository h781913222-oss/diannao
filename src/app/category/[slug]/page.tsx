import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/ui/ToolCard'
import { TagBadge } from '@/components/ui/TagBadge'
import { CATEGORIES } from '@/constants/index'
import { getToolsByCategory } from '@/lib/queries'
import { siteConfig } from '@/lib/config'

interface ICategoryPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ICategoryPageProps): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.slug === params.slug)
  if (!category) {
    return { title: '未找到 - ' + siteConfig.name }
  }
  return {
    title: `${category.name} - ${siteConfig.name}`,
    description: `${category.description}。精选${category.name}资源，持续更新。`,
  }
}

export default async function CategoryPage({ params }: ICategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug)
  if (!category) {
    notFound()
  }

  let tools: Awaited<ReturnType<typeof getToolsByCategory>> = []
  try {
    tools = await getToolsByCategory(params.slug)
  } catch (err) {
    console.error('Failed to fetch category tools:', err)
  }

  if (tools.length === 0) {
    const demoData: Record<string, any[]> = {
      software: [
        { id: 's1', name: '7-Zip', url: 'https://www.7-zip.org', description: '开源免费压缩软件，支持多种格式', category: 'software', tags: ['免费', '开源', '文件'], is_featured: true },
        { id: 's2', name: 'ShareX', url: 'https://getsharex.com', description: '功能强大的截图和文件分享工具', category: 'software', tags: ['免费', '开源', '文件'], is_hot: true },
        { id: 's3', name: 'PotPlayer', url: 'https://potplayer.daum.net', description: '轻量级视频播放器，支持各种格式', category: 'software', tags: ['免费', '视频', '小白友好'], is_featured: true },
      ],
      github: [
        { id: 'g1', name: 'VS Code', url: 'https://github.com/microsoft/vscode', description: '微软开源代码编辑器', category: 'github', tags: ['免费', '开源', '编程'], is_hot: true },
        { id: 'g2', name: 'React', url: 'https://github.com/facebook/react', description: 'Meta开源的UI库', category: 'github', tags: ['免费', '开源', '编程'], is_featured: true },
      ],
      tools: [
        { id: 't1', name: 'Remove.bg', url: 'https://www.remove.bg', description: 'AI一键抠图', category: 'tools', tags: ['AI', '图片', '免费'], is_hot: true },
        { id: 't2', name: 'Excalidraw', url: 'https://excalidraw.com', description: '手绘风格流程图', category: 'tools', tags: ['免费', '设计师', '新上线'], is_new: true },
      ],
      ai: [
        { id: 'a1', name: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI AI对话助手', category: 'ai', tags: ['AI', '写作', '热门'], is_hot: true },
        { id: 'a2', name: 'Cursor', url: 'https://cursor.com', description: 'AI代码编辑器', category: 'ai', tags: ['AI', '编程', '免费'], is_featured: true },
        { id: 'a3', name: 'Bolt.new', url: 'https://bolt.new', description: 'AI全栈开发工具', category: 'ai', tags: ['AI', '编程', '新上线'], is_new: true },
      ],
      hardware: [
        { id: 'h1', name: 'CPU-Z', url: 'https://www.cpuid.com/softwares/cpu-z.html', description: '硬件检测工具', category: 'hardware', tags: ['免费', '硬件', '系统'], is_featured: true },
      ],
      system: [
        { id: 'sy1', name: 'Dism++', url: 'https://github.com/Chuyu-Team/Dism-Release', description: 'Windows系统清理工具', category: 'system', tags: ['免费', '开源', '系统'], is_hot: true },
      ],
    }
    tools = demoData[params.slug] || []
  }

  const allTags = Array.from(new Set(tools.flatMap((t: any) => t.tags || [])))

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              {category.name}
            </h1>
            <p className="text-text-secondary mt-2">{category.description}</p>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span className="text-sm text-text-muted">筛选：</span>
            {allTags.slice(0, 10).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Tools grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool: any, index: number) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">该分类暂无内容，敬请期待</p>
        </div>
      )}
    </div>
  )
}
