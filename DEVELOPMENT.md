# TechVerse 导航聚合网站 — 开发文档

> **版本**：v2.0  
> **最后更新**：2026-06-21  
> **技术栈**：Next.js 14 + TypeScript + Tailwind CSS 3 + Supabase + Vercel  
> **设计风格**：Raycast 极简科技风 + 深色宇宙感

---

## 一、技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 (App Router) | Server Component 优先，SEO 友好 |
| 开发语言 | TypeScript | 全类型覆盖，无 `any` |
| 样式 | Tailwind CSS 3 | 自定义 Material Design 3 主题 + 暗黑模式 |
| 数据库 | Supabase (PostgreSQL) | 免费额度，可视化后台 |
| 部署 | Vercel | 自动 CI/CD，Git 推送即部署 |
| 字体 | Geist / Inter / Geist Mono | Google Fonts，现代无衬线 |
| 图标 | Lucide React | 统一图标库 |
| 动画 | Framer Motion | 页面动画和过渡 |

---

## 二、项目目录结构

```
E:\xiangmu\
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 根布局（暗色主题 + 导航栏 + 字体）
│   │   ├── page.tsx                  # 首页（Hero + BentoGrid + Trending）
│   │   ├── globals.css               # 全局样式（glass-panel、text-gradient等）
│   │   ├── category/[slug]/page.tsx  # 分类页（6 大分类）
│   │   ├── pc-build/page.tsx         # 配置单推荐页
│   │   ├── submit/                   # 工具投稿（Page + SubmitForm）
│   │   └── contact/page.tsx          # 联系我们
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # 悬浮导航栏（全宽 glass 风格）
│   │   │   └── Footer.tsx            # 页脚（单行双列）
│   │   ├── ui/                       # 基础 UI 组件库
│   │   │   ├── Button.tsx            # 统一按钮组件（5 个变体）
│   │   │   ├── Card.tsx              # 统一卡片组件（4 个变体）
│   │   │   ├── Input.tsx             # 统一输入框组件
│   │   │   ├── Badge.tsx             # 统一标签组件（6 个变体）
│   │   │   ├── Modal.tsx             # 统一弹层组件
│   │   │   ├── Tabs.tsx              # 统一选项卡组件
│   │   │   ├── Container.tsx         # 统一内容容器
│   │   │   ├── Section.tsx           # 统一页面区块
│   │   │   ├── SectionTitle.tsx      # 统一区块标题
│   │   │   └── SearchBar.tsx         # 搜索组件
│   │   └── sections/                 # 页面区块组件
│   │       ├── HeroSection.tsx       # Hero 区域（Shader + 粒子 + Glass Panel）
│   │       ├── ShaderBackground.tsx  # WebGL 极光 Shader 背景
│   │       ├── ParticleScene.tsx     # Three.js 粒子系统
│   │       ├── BentoGrid.tsx         # 分类网格（Explore Universe）
│   │       ├── TrendingToday.tsx     # 横向滚动 Trending 卡片
│   │       └── PcBuildSelector.tsx   # 配置单选择器
│   ├── lib/
│   │   ├── supabase.ts               # Supabase 客户端初始化
│   │   ├── queries.ts                # 所有数据库查询封装（含 Fallback 机制）
│   │   ├── utils.ts                  # 工具函数（cn、getFaviconUrl、formatDate）
│   │   └── config.ts                 # 站点配置（名称、邮箱、联系方式）
│   ├── types/
│   │   └── index.ts                  # TypeScript 接口定义
│   └── constants/
│       └── index.ts                  # 分类、标签、预算档位常量
├── design/                           # 设计资源
│   ├── code.txt                      # Stitch 设计稿导出代码
│   ├── Main Content.png              # 首页设计稿
│   ├── TechVerse Hardware Center.png # 配置单页设计稿
│   ├── TechVerse Community Discovery.png # 分类页风格参考
│   └── TechVerse Learning Hub.png    # 标题区风格参考
├── docs/                             # 项目文档
│   ├── DESIGN_SYSTEM.md              # 设计系统文档（唯一视觉标准）
│   ├── COMPONENT_LIBRARY.md          # 组件库文档
│   ├── PAGE_MAP.md                   # 页面映射文档
│   └── VISUAL_GUARDRAIL.md           # 视觉规范文档（Design Freeze）
├── public/                           # 静态资源
├── package.json                      # 依赖
├── tailwind.config.ts                # 主题配置（Material Design 3 色板）
├── tsconfig.json                     # TypeScript 配置
├── next.config.js                    # Next.js 配置
├── .env.local                        # 环境变量（不提交）
├── .gitignore                        # 忽略 node_modules/.env/.next
├── PRD.md                            # 产品需求文档
└── DEVELOPMENT.md                    # 本文档
```

---

## 三、数据库表结构

### 3.1 `tools` 表（工具主表）

```sql
CREATE TABLE tools (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  url           text NOT NULL,
  description   text NOT NULL,
  category      text NOT NULL,    -- software/github/tools/ai/hardware/system
  tags          text[],
  icon_url      text,
  is_featured   boolean DEFAULT false,
  is_hot        boolean DEFAULT false,
  is_new        boolean DEFAULT false,
  is_published  boolean DEFAULT true,
  sort_order    integer DEFAULT 0,
  created_at    timestamp with time zone DEFAULT now(),
  updated_at    timestamp with time zone DEFAULT now()
);

-- 索引
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_published ON tools(is_published);
CREATE INDEX idx_tools_hot ON tools(is_hot);
CREATE INDEX idx_tools_featured ON tools(is_featured);
CREATE INDEX idx_tools_new ON tools(is_new);
CREATE INDEX idx_tools_sort ON tools(sort_order DESC);
```

### 3.2 `submissions` 表（用户投稿）

```sql
CREATE TABLE submissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  url         text NOT NULL,
  description text NOT NULL,
  category    text NOT NULL,
  reason      text,
  contact     text,
  status      text DEFAULT 'pending',  -- pending / approved / rejected
  created_at  timestamp with time zone DEFAULT now()
);
```

### 3.3 `pc_builds` 表（配置单）

```sql
CREATE TABLE pc_builds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_label  text NOT NULL,
  budget_min    integer NOT NULL,
  budget_max    integer NOT NULL,
  cpu           text NOT NULL,
  motherboard   text NOT NULL,
  memory        text NOT NULL,
  storage       text NOT NULL,
  gpu           text NOT NULL,
  case_psu      text NOT NULL,
  total_price   integer NOT NULL,
  use_case      text NOT NULL,
  updated_at    timestamp with time zone DEFAULT now()
);

-- 索引
CREATE INDEX idx_pc_builds_budget ON pc_builds(budget_min);
```

### 3.4 RLS 安全策略（Supabase 必须设置）

```sql
-- tools 表：匿名用户可读
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON tools FOR SELECT USING (is_published = true);

-- submissions 表：匿名用户可插入（投稿），管理员可读取
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read admin" ON submissions FOR SELECT USING (auth.role() = 'authenticated');

-- pc_builds 表：匿名用户可读
ALTER TABLE pc_builds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read" ON pc_builds FOR SELECT USING (true);
```

> **注意**：如果不设 RLS，Supabase 默认拒绝匿名访问，页面会报错。

---

## 四、前端 API 封装

所有查询函数封装在 `src/lib/queries.ts`，组件只调用不直接操作数据库：

```typescript
// 按分类获取工具
getToolsByCategory(category: string) -> ITool[]

// 获取所有已发布工具
getAllTools() -> ITool[]

// 获取热门工具（is_hot = true）
getHotTools() -> ITool[]

// 获取新工具（is_new = true）
getNewTools() -> ITool[]

// 获取编辑推荐（is_featured = true）
getFeaturedTools() -> ITool[]

// 搜索工具（name/description 模糊匹配）
searchTools(query: string) -> ITool[]

// 获取所有配置单
getPCBuilds() -> IPCBuild[]

// 提交投稿（匿名用户可用）
createSubmission(submission) -> void
```

**Fallback 机制**：如果 Supabase 未配置（环境变量缺失），所有查询函数自动返回 demo 数据，确保页面能正常显示。

---

## 五、环境变量

项目根目录创建 `.env.local` 文件：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名Key
```

> **⚠️ 不要把 `.env.local` 提交到 Git！** 已加入 `.gitignore`。

**获取方式**：
1. 打开 [supabase.com](https://supabase.com)
2. 进入项目 → Project Settings → API
3. `URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 六、已完成内容

### 6.1 基础设施
- ✅ Next.js 14 项目搭建（App Router）
- ✅ TypeScript 配置
- ✅ Tailwind CSS 3 配置（Material Design 3 色板）
- ✅ 字体配置（Geist / Inter / Geist Mono）
- ✅ 全局样式（glass-panel、text-gradient、animations）

### 6.2 UI 组件库
- ✅ Button 组件（5 个变体：primary/secondary/ghost/outline/danger）
- ✅ Card 组件（4 个变体：default/interactive/trending/horizontal）
- ✅ Input 组件（text/email/url/textarea/select）
- ✅ Badge 组件（6 个变体：default/category/rank/feature/tag/live）
- ✅ Modal 组件（弹层组件）
- ✅ Tabs 组件（水平/垂直）
- ✅ Container 组件（3 种尺寸）
- ✅ Section 组件（支持背景/分隔线）
- ✅ SectionTitle 组件（badge + 渐变标题）
- ✅ SearchBar 组件（搜索功能）

### 6.3 布局组件
- ✅ Navbar（全宽 glass 导航栏）
- ✅ Footer（单行双列页脚）

### 6.4 页面区块组件
- ✅ HeroSection（Shader + 粒子 + Glass Panel）
- ✅ ShaderBackground（WebGL 极光背景）
- ✅ ParticleScene（Three.js 粒子系统）
- ✅ BentoGrid（Explore Universe 分类网格）
- ✅ TrendingToday（横向滚动 Trending 卡片）
- ✅ PcBuildSelector（配置单选择器）

### 6.5 页面
- ✅ 首页 `/`（Hero + BentoGrid + Trending + Featured + New + PCBuild）
- ✅ 分类页 `/category/[slug]`
- ✅ 配置单页 `/pc-build`
- ✅ 投稿页 `/submit`
- ✅ 联系页 `/contact`

### 6.6 数据层
- ✅ Supabase 客户端初始化
- ✅ 数据库查询封装（含 Fallback 机制）
- ✅ TypeScript 类型定义
- ✅ 常量定义（CATEGORIES、TAGS、BUDGET_TIERS）
- ✅ 站点配置（config.ts）

---

## 七、当前开发阶段

**阶段**：Batch1 首页已完成，Design Freeze

**状态**：首页视觉已冻结，准备进入功能页面开发。

---

## 八、当前页面改造进度

| 优先级 | 页面 | 状态 | 说明 |
|--------|------|------|------|
| **P0** | 首页 `/` | ✅ 已完成 | Hero 视觉已冻结，符合 Figma |
| **P0** | 配置单页 `/pc-build` | ✅ 已完成 | 使用新组件库 |
| **P1** | 分类页 `/category/[slug]` | ✅ 已完成 | 使用新组件库 |
| **P2** | 投稿页 `/submit` | ✅ 已完成 | 使用新组件库 |
| **P2** | 联系页 `/contact` | ✅ 已完成 | 使用新组件库 |

---

## 九、当前已知问题

### 9.1 待清理项
- 废弃组件未清理（PCBBackground、HotList、CategoryIcon、TagBadge）
- phosphor-icons 依赖未移除

---

## 十、当前任务

**任务**：进入功能页面开发

**目标**：在首页 Design Freeze 基础上，开发其他功能页面

**设计标准**：Figma / Stitch 设计稿

**风格关键词**：
- Premium SaaS
- Deep Space
- Minimal
- Immersive
- Elegant

---

## 十一、下一步计划

### 短期（功能页面开发）
- [ ] 清理废弃组件
- [ ] 移除 phosphor-icons 依赖
- [ ] 功能页面视觉对齐首页设计语言

### 中期（数据接入）
- [ ] 配置 `.env.local` 并连接 Supabase
- [ ] 在 Supabase 中创建 3 张表
- [ ] 设置 RLS 安全策略
- [ ] 导入真实数据（替换 demo 数据）

### 长期（上线）
- [ ] 修改 `config.ts` 中的占位符（网站名、邮箱、微信、抖音）
- [ ] 配置自定义域名（可选）
- [ ] 提交到搜索引擎（Google / 百度）
- [ ] 生成 sitemap.xml

---

## 十二、关键文件速查

| 需求 | 对应文件 |
|------|---------|
| 改网站名/邮箱/联系方式 | `src/lib/config.ts` |
| 改分类 | `src/constants/index.ts` → `CATEGORIES` |
| 改标签 | `src/constants/index.ts` → `TAGS` |
| 改预算档位 | `src/constants/index.ts` → `BUDGET_TIERS` |
| 改配色 | `tailwind.config.ts` + `src/app/globals.css` |
| 改导航栏 | `src/components/layout/Navbar.tsx` |
| 改 Hero 视觉 | `src/components/sections/HeroSection.tsx` |
| 改 Aurora 效果 | `src/components/sections/ShaderBackground.tsx` |
| 改粒子效果 | `src/components/sections/ParticleScene.tsx` |
| 改数据库查询 | `src/lib/queries.ts` |
| 改类型定义 | `src/types/index.ts` |

---

## 十三、设计系统

详细设计规范请参考：
- `docs/DESIGN_SYSTEM.md` - 设计系统文档（唯一视觉标准）
- `docs/VISUAL_GUARDRAIL.md` - 视觉规范文档（Design Freeze）

### 核心设计 token
- **背景色**：`#101415`（bg-background）
- **主文字**：`#e0e3e5`（text-on-surface）
- **次文字**：`#cfc4c5`（text-on-surface-variant）
- **强调色（青蓝）**：`#4cd7f6`（tertiary）
- **强调色（紫）**：`#ddb7ff`（secondary）
- **字体**：Geist（标题）/ Inter（正文）/ Geist Mono（代码）

### Design Freeze 状态
- ✅ Hero 视觉方向已冻结
- ✅ Premium SaaS 风格已确定
- ✅ Deep Space 氛围已确定
- ✅ 不再新增视觉元素
- ✅ 所有修改必须遵循 Figma 设计稿

---

*文档生成时间：2026-06-21*  
*基于当前代码库实际状态整理*
