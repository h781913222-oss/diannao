export interface ITool {
  id: string
  name: string
  url: string
  description: string
  category: string
  tags: string[]
  icon_url?: string
  is_featured?: boolean
  is_hot?: boolean
  is_new?: boolean
  is_published?: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface ISubmission {
  id: string
  name: string
  url: string
  description: string
  category: string
  reason?: string
  contact?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
}

export interface IPCBuild {
  id: string
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
  updated_at?: string
}

export interface ICategory {
  slug: string
  name: string
  icon: string
  description: string
}

export type TCategorySlug = 'software' | 'github' | 'tools' | 'ai' | 'hardware' | 'system'
