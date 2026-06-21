import { supabase } from './supabase'
import { ITool, ISubmission, IPCBuild } from '@/types/index'

/* ── Demo data ─────────────────────────────────────────────── */

const DEMO_TOOLS: ITool[] = [
  {
    id: '1', name: 'Cursor', url: 'https://cursor.com',
    description: 'AI驱动的代码编辑器，内置GPT-4，让编程效率翻倍',
    category: 'ai', tags: ['AI', '编程', '免费'],
    is_hot: true, is_featured: false, is_new: false,
  },
  {
    id: '2', name: 'ChatGPT', url: 'https://chat.openai.com',
    description: 'OpenAI出品的AI对话助手，写作、编程、翻译全能',
    category: 'ai', tags: ['AI', '写作', '热门'],
    is_hot: true, is_featured: false, is_new: false,
  },
  {
    id: '3', name: '7-Zip', url: 'https://www.7-zip.org',
    description: '开源免费压缩软件，支持多种格式，压缩率高',
    category: 'software', tags: ['免费', '开源', '文件'],
    is_hot: true, is_featured: false, is_new: false,
  },
  {
    id: '4', name: 'VS Code', url: 'https://code.visualstudio.com',
    description: '微软出品的免费代码编辑器，插件生态丰富',
    category: 'github', tags: ['免费', '开源', '编程'],
    is_hot: true, is_featured: false, is_new: false,
  },
  {
    id: '5', name: 'Remove.bg', url: 'https://www.remove.bg',
    description: 'AI一键抠图，自动去除背景，效果精准',
    category: 'tools', tags: ['AI', '图片', '免费'],
    is_hot: true, is_featured: false, is_new: false,
  },
  {
    id: '6', name: 'Bolt.new', url: 'https://bolt.new',
    description: 'AI全栈开发工具，一句话生成完整应用',
    category: 'ai', tags: ['AI', '编程', '新上线'],
    is_hot: false, is_featured: false, is_new: true,
  },
  {
    id: '7', name: 'Excalidraw', url: 'https://excalidraw.com',
    description: '手绘风格流程图工具，协作功能强大',
    category: 'tools', tags: ['免费', '设计师', '新上线'],
    is_hot: false, is_featured: false, is_new: true,
  },
  {
    id: '8', name: 'Ollama', url: 'https://ollama.com',
    description: '本地运行大语言模型，隐私安全，无需联网',
    category: 'ai', tags: ['开源', 'AI', '开发者'],
    is_hot: false, is_featured: false, is_new: true,
  },
  {
    id: '9', name: 'Screenity', url: 'https://www.screenity.com',
    description: '免费开源的屏幕录制工具，支持标注和剪辑',
    category: 'tools', tags: ['免费', '开源', '视频'],
    is_hot: false, is_featured: true, is_new: false,
  },
  {
    id: '10', name: 'ShareX', url: 'https://getsharex.com',
    description: '功能强大的截图和文件分享工具，支持自定义工作流',
    category: 'software', tags: ['免费', '开源', '文件'],
    is_hot: false, is_featured: true, is_new: false,
  },
  {
    id: '11', name: 'Notion', url: 'https://www.notion.so',
    description: '全能笔记和知识管理工具，支持数据库和协作',
    category: 'tools', tags: ['办公', '免费', '小白友好'],
    is_hot: false, is_featured: true, is_new: false,
  },
  {
    id: '12', name: 'Figma', url: 'https://www.figma.com',
    description: '在线设计协作工具，UI/UX设计行业标准',
    category: 'tools', tags: ['免费', '设计师', '办公'],
    is_hot: false, is_featured: true, is_new: false,
  },
  {
    id: '13', name: 'PotPlayer', url: 'https://potplayer.daum.net',
    description: '轻量级视频播放器，支持各种格式',
    category: 'software', tags: ['免费', '视频', '小白友好'],
    is_hot: false, is_featured: false, is_new: false,
  },
  {
    id: '14', name: 'React', url: 'https://github.com/facebook/react',
    description: 'Meta开源的UI库，前端开发框架',
    category: 'github', tags: ['免费', '开源', '编程'],
    is_hot: false, is_featured: false, is_new: false,
  },
  {
    id: '15', name: 'CPU-Z', url: 'https://www.cpuid.com/softwares/cpu-z.html',
    description: '硬件检测工具，查看CPU、主板、内存信息',
    category: 'hardware', tags: ['免费', '硬件', '系统'],
    is_hot: false, is_featured: false, is_new: false,
  },
  {
    id: '16', name: 'Dism++', url: 'https://github.com/Chuyu-Team/Dism-Release',
    description: 'Windows系统清理工具，功能强大',
    category: 'system', tags: ['免费', '开源', '系统'],
    is_hot: false, is_featured: false, is_new: false,
  },
]

/* ── Query helpers ──────────────────────────────────────────── */

export async function getToolsByCategory(category: string): Promise<ITool[]> {
  if (!supabase) return DEMO_TOOLS.filter((t) => t.category === category)
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('sort_order', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAllTools(): Promise<ITool[]> {
  if (!supabase) return DEMO_TOOLS
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getHotTools(): Promise<ITool[]> {
  if (!supabase) return DEMO_TOOLS.filter((t) => t.is_hot)
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('is_published', true)
    .eq('is_hot', true)
    .order('sort_order', { ascending: false })
    .limit(10)
  if (error) throw error
  return data || []
}

export async function getNewTools(): Promise<ITool[]> {
  if (!supabase) return DEMO_TOOLS.filter((t) => t.is_new)
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('is_published', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) throw error
  return data || []
}

export async function getFeaturedTools(): Promise<ITool[]> {
  if (!supabase) return DEMO_TOOLS.filter((t) => t.is_featured)
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: false })
    .limit(10)
  if (error) throw error
  return data || []
}

export async function searchTools(query: string): Promise<ITool[]> {
  const q = query.toLowerCase()
  if (!supabase) {
    return DEMO_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    )
  }
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('is_published', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('sort_order', { ascending: false })
    .limit(20)
  if (error) throw error
  return data || []
}

export async function getPCBuilds(): Promise<IPCBuild[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('pc_builds')
    .select('*')
    .order('budget_min', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createSubmission(
  submission: Omit<ISubmission, 'id' | 'status' | 'created_at'>
): Promise<void> {
  if (!supabase) {
    console.log('Demo mode: submission would be', submission)
    return
  }
  const { error } = await supabase
    .from('submissions')
    .insert([{ ...submission, status: 'pending' }])
  if (error) throw error
}
