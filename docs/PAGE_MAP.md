# TechVerse 页面映射文档

> **版本**：v1.0  
> **生成日期**：2025-06-20  
> **说明**：本文档统计 TechVerse 项目全部页面和路由，用于指导 UI 重构优先级

---

## 一、路由总览

| 页面 | 路由 | 文件 | 设计稿 | 优先级 | 状态 |
|------|------|------|--------|--------|------|
| 首页 | `/` | `src/app/page.tsx` | Main Content.png | **P0** | ✅ 已完成 |
| 分类页 | `/category/[slug]` | `src/app/category/[slug]/page.tsx` | Community Discovery.png（参考） | **P1** | 需重构 |
| 配置单页 | `/pc-build` | `src/app/pc-build/page.tsx` | Hardware Center.png | **P0** | 需重构 |
| 投稿页 | `/submit` | `src/app/submit/page.tsx` | 无独立设计稿 | **P2** | 需重构 |
| 联系页 | `/contact` | `src/app/contact/page.tsx` | 无独立设计稿 | **P2** | 需重构 |

> **动态路由说明**：`[slug]` 支持 6 个值：`software` / `github` / `tools` / `ai` / `hardware` / `system`

---

## 二、页面详情

### 2.1 首页 (`/`)

| 属性 | 内容 |
|------|------|
| **路由** | `/` |
| **文件** | `src/app/page.tsx` |
| **类型** | Server Component (async) |
| **用途** | 网站入口，展示 Hero + 分类导航 + 热榜 + 推荐 + 新收录 + 配置单 |
| **设计稿** | `Main Content.png`（完整对应） |
| **SEO** | `siteConfig.name — 找软件、找工具、找配置` |
| **数据获取** | `getHotTools()` / `getNewTools()` / `getFeaturedTools()` |
| **重构优先级** | **P0** |

#### 依赖组件（旧版）

```
page.tsx
├── HeroSection          ← 重写：Shader + 粒子 + Glass Panel
├── CategoryIcon         ← 删除，改为 BentoGrid 内卡片
├── HotList              ← 重写：改为 TrendingToday 横向滚动
├── ToolCard             ← 重写：改为 glass-panel 风格
├── PcBuildSelector      ← 重写：改为 HardwareCenter 风格
└── SearchBar            ← 已更新（glass-panel 风格）
```

#### 现有区块结构

```
HomePage
├── HeroSection（全屏 Hero + PCB 背景 + 搜索 + Feature Pills）
├── Categories（6 个分类 pill 横向排列）
├── HotList（纵向列表排行，5 条）
├── Featured Tools（3 列卡片网格）
├── New Tools（3 列卡片网格）
└── PcBuildSelector（预算档位 + 配置详情）
```

#### 重构目标

```
HomePage（新）
├── HeroSection（Shader 极光 + 粒子 + Glass Panel + CTA按钮）
├── Explore Universe（Bento Grid 8 分类卡片）
├── Trending Today（横向滚动 3 卡片）
└── PcBuildSelector（保留，但改为 glass-panel 风格）
```

---

### 2.2 分类页 (`/category/[slug]`)

| 属性 | 内容 |
|------|------|
| **路由** | `/category/[slug]`（动态路由） |
| **文件** | `src/app/category/[slug]/page.tsx` |
| **类型** | Server Component (async) |
| **用途** | 按分类展示工具，支持标签筛选 |
| **设计稿** | `Community Discovery.png`（风格参考，去除社交元素） |
| **SEO** | 动态：`${category.name} - ${siteConfig.name}` |
| **数据获取** | `getToolsByCategory(slug)` |
| **重构优先级** | **P1** |

#### 动态路由参数

| slug | 名称 | 图标 | 说明 |
|------|------|------|------|
| `software` | 软件下载 | 💾 | 常用软件、安装教程 |
| `github` | GitHub精选 | 🐙 | 优质开源项目推荐 |
| `tools` | 在线工具 | 🔧 | 图片压缩、格式转换等 |
| `ai` | AI工具 | 🤖 | AI写作、绘图、视频等 |
| `hardware` | 硬件推荐 | 🖥️ | 装机配置、选购指南 |
| `system` | 系统优化 | ⚡ | Windows技巧、驱动教程 |

#### 依赖组件（旧版）

```
page.tsx
├── ToolCard             ← 重写：改为 glass-panel 纵向卡片
├── TagBadge             ← 删除，改为 Badge 组件
└── generateMetadata     ← 保留
```

#### 现有结构

```
CategoryPage
├── Header（分类图标 + 名称 + 描述）
├── Tag Filter（标签 pills 横向排列）
└── Tools Grid（3 列卡片网格）
```

#### 重构目标

```
CategoryPage（新）
├── SectionTitle（badge + 渐变标题 + 描述）
├── Tabs（horizontal，标签筛选）
└── ToolCard Grid（3 列，Community Discovery 风格卡片）
```

---

### 2.3 配置单页 (`/pc-build`)

| 属性 | 内容 |
|------|------|
| **路由** | `/pc-build` |
| **文件** | `src/app/pc-build/page.tsx`（数据层）+ `PCBuildContent.tsx`（展示层） |
| **类型** | Server Component + Client Component |
| **用途** | 展示 4 档预算配置单，支持咨询 |
| **设计稿** | `Hardware Center.png`（完整对应） |
| **SEO** | `配置单推荐 - ${siteConfig.name}` |
| **数据获取** | `getPCBuilds()` + `DEMO_BUILDS` fallback |
| **重构优先级** | **P0** |

#### 依赖组件（旧版）

```
pc-build/page.tsx
└── PCBuildContent.tsx
    ├── Phosphor Icons    ← 迁移到 Lucide
    ├── card CSS          ← 改为 glass-panel
    └── glow-hover        ← 删除
```

#### 现有结构

```
PCBuildPage
├── Header（Cpu 图标 + "配置单推荐" 标题）
├── Build Cards Grid（2 列，预算卡片）
│   ├── 预算标签 + 价格
│   ├── 配置项列表（CPU/主板/内存/硬盘/显卡/机箱电源）
│   ├── 适用场景标签
│   └── 咨询按钮
└── 定制配置卡片（联系方式 + 预约按钮）
```

#### 重构目标

```
PCBuildPage（新）
├── SectionTitle（Hardware Center Live badge + 渐变标题 + 描述）
├── Two-Column Layout
│   ├── Tabs（vertical，预算档位列表）
│   └── Card（配置详情大图卡片）
└── Contact Card（咨询联系方式）
```

---

### 2.4 投稿页 (`/submit`)

| 属性 | 内容 |
|------|------|
| **路由** | `/submit` |
| **文件** | `src/app/submit/page.tsx`（壳）+ `SubmitForm.tsx`（表单） |
| **类型** | Server Component + Client Component |
| **用途** | 用户提交工具推荐 |
| **设计稿** | 无独立设计稿，使用 TechVerse 通用设计系统 |
| **SEO** | `工具投稿 - ${siteConfig.name}` |
| **数据提交** | `createSubmission(formData)` |
| **重构优先级** | **P2** |

#### 依赖组件（旧版）

```
submit/page.tsx
└── SubmitForm.tsx
    ├── Phosphor Icons    ← 迁移到 Lucide
    ├── card CSS          ← 改为 glass-panel
    ├── input styles      ← 改为 Input 组件
    └── button styles     ← 改为 Button 组件
```

#### 现有结构

```
SubmitPage
├── Header（PaperPlaneTilt 图标 + "工具投稿" 标题）
├── Success State（提交成功提示）
└── Form（6 个输入字段）
    ├── 网站名称（必填）
    ├── 网站链接（必填）
    ├── 网站简介（必填，限50字）
    ├── 推荐分类（下拉选择）
    ├── 推荐理由（选填）
    └── 联系方式（选填）
```

#### 重构目标

```
SubmitPage（新）
├── SectionTitle（"Community Picks" + 描述 + 可选 action）
├── Card（glass-panel 包裹表单）
│   ├── Input（text）
   ├── Input（url）
   ├── Input（textarea，50字限制）
   ├── Input（select，分类）
   ├── Input（textarea，理由）
   ├── Input（text，联系方式）
   └── Button（primary，提交）
└── Success State（Card + Check 图标）
```

---

### 2.5 联系页 (`/contact`)

| 属性 | 内容 |
|------|------|
| **路由** | `/contact` |
| **文件** | `src/app/contact/page.tsx`（壳）+ `ContactContent.tsx`（内容） |
| **类型** | Server Component + Client Component |
| **用途** | 展示联系方式、到店咨询 |
| **设计稿** | 无独立设计稿，使用 TechVerse 通用设计系统 |
| **SEO** | `联系我们 - ${siteConfig.name}` |
| **数据** | `siteConfig.email` / `wechat` / `douyin` |
| **重构优先级** | **P2** |

#### 依赖组件（旧版）

```
contact/page.tsx
└── ContactContent.tsx
    ├── Phosphor Icons    ← 迁移到 Lucide
    ├── card CSS          ← 改为 glass-panel
    └── button styles     ← 改为 Button 组件
```

#### 现有结构

```
ContactPage
├── Header（"联系我们" 标题）
├── Contact Cards Grid（2 列，4 张卡片）
│   ├── 邮箱（可点击发邮件）
│   ├── 微信（纯展示）
│   ├── 抖音（纯展示）
│   └── 回复时间（纯展示）
└── 到店咨询卡片（描述 + 预约按钮）
```

#### 重构目标

```
ContactPage（新）
├── SectionTitle（"Start Your Tech Odyssey" + 描述 + 双按钮）
├── Card Grid（联系方式卡片）
│   ├── Card（邮箱，带图标 + 链接）
   ├── Card（微信）
   ├── Card（抖音）
   └── Card（回复时间）
└── Card（到店咨询，描述 + Button）
```

---

## 三、布局文件

| 文件 | 类型 | 说明 | 状态 |
|------|------|------|------|
| `src/app/layout.tsx` | Root Layout | 全局字体、Navbar、Footer、Shell | ✅ 已更新 |
| `src/app/globals.css` | Global CSS | glass-panel、text-gradient、动画等 | ✅ 已更新 |

---

## 四、设计稿映射关系

| 设计稿文件 | 对应页面 | 映射说明 | 还原度目标 |
|-----------|---------|---------|-----------|
| `Main Content.png` | 首页 `/` | 完全对应：Hero → Glass Panel Hero；分类 → Bento Grid；热榜 → Trending Today | **95%** |
| `TechVerse Community Discovery.png` | 分类页 `/category/[slug]` | 风格参考：卡片布局、标签系统。去除社交元素（点赞/评论/用户头像） | 80% |
| `TechVerse Hardware Center.png` | 配置单页 `/pc-build` | 完全对应：标题区 + 两列布局（左侧列表 + 右侧卡片） | **95%** |
| `TechVerse Learning Hub.png` | 无直接对应 | 标题区风格（badge + 渐变标题 + 描述 + 双按钮）可作为投稿/联系页参考 | 80% |

---

## 五、重构优先级矩阵

| 优先级 | 页面 | 原因 |
|--------|------|------|
| **P0** | 首页 `/` | 有完整设计稿 + 代码，是网站的门面 |
| **P0** | 配置单页 `/pc-build` | 有完整设计稿，核心差异化功能 |
| **P1** | 分类页 `/category/[slug]` | 有 Community Discovery 风格参考，用户核心浏览路径 |
| **P2** | 投稿页 `/submit` | 无独立设计稿，使用通用设计系统即可 |
| **P2** | 联系页 `/contact` | 无独立设计稿，使用通用设计系统即可 |

---

## 六、依赖组件清单（当前 vs 重构后）

### 6.1 当前依赖组件（旧版）

| 组件 | 路径 | 使用情况 | 命运 |
|------|------|---------|------|
| HeroSection | `components/sections/HeroSection.tsx` | 首页 | 重写 |
| HotList | `components/sections/HotList.tsx` | 首页 | 删除，改为 TrendingToday |
| PcBuildSelector | `components/sections/PcBuildSelector.tsx` | 首页 | 删除，改为 HardwareCenter |
| PCBBackground | `components/sections/PCBBackground.tsx` | HeroSection | 删除 |
| CategoryIcon | `components/ui/CategoryIcon.tsx` | 首页 | 删除 |
| ToolCard | `components/ui/ToolCard.tsx` | 首页、分类页 | 重写 |
| TagBadge | `components/ui/TagBadge.tsx` | 分类页、ToolCard | 删除，改为 Badge |
| SearchBar | `components/ui/SearchBar.tsx` | Navbar、HeroSection | 已更新 |
| PCBuildContent | `app/pc-build/PCBuildContent.tsx` | 配置单页 | 重写 |
| SubmitForm | `app/submit/SubmitForm.tsx` | 投稿页 | 重写 |
| ContactContent | `app/contact/ContactContent.tsx` | 联系页 | 重写 |

### 6.2 重构后组件（新）

| 组件 | 路径 | 使用情况 | 来源 |
|------|------|---------|------|
| HeroSection | `components/sections/HeroSection.tsx` | 首页 | 重写（Shader + 粒子） |
| BentoGrid | `components/sections/BentoGrid.tsx` | 首页 | 新增 |
| TrendingToday | `components/sections/TrendingToday.tsx` | 首页 | 新增（替代 HotList） |
| HardwareCenter | `components/sections/HardwareCenter.tsx` | 首页、配置单页 | 新增（替代 PcBuildSelector） |
| ShaderBackground | `components/sections/ShaderBackground.tsx` | 首页 | 新增 |
| ParticleScene | `components/sections/ParticleScene.tsx` | 首页 | 新增 |
| ToolCard | `components/ui/ToolCard.tsx` | 首页、分类页 | 重写（基于 Card 组件） |
| Button | `components/ui/Button.tsx` | 全部页面 | 新增 |
| Card | `components/ui/Card.tsx` | 全部页面 | 新增 |
| Input | `components/ui/Input.tsx` | 投稿页 | 新增 |
| Badge | `components/ui/Badge.tsx` | 分类页、ToolCard | 新增 |
| Modal | `components/ui/Modal.tsx` | 搜索弹层 | 新增 |
| Tabs | `components/ui/Tabs.tsx` | 分类页、配置单页 | 新增 |
| Container | `components/ui/Container.tsx` | 全部页面 | 新增 |
| Section | `components/ui/Section.tsx` | 全部页面 | 新增 |
| SectionTitle | `components/ui/SectionTitle.tsx` | 全部页面 | 新增 |

---

## 七、API/数据层不变清单

以下文件在页面重构中**保持不变**：

| 文件 | 说明 |
|------|------|
| `src/lib/queries.ts` | 所有数据库查询函数 |
| `src/lib/supabase.ts` | Supabase 客户端 |
| `src/lib/utils.ts` | 工具函数（cn、getFaviconUrl、formatDate） |
| `src/types/index.ts` | TypeScript 类型定义 |
| `src/constants/index.ts` | 常量（CATEGORIES、TAGS、BUDGET_TIERS） |
| `src/lib/config.ts` | 站点配置（siteConfig） |

---

## 八、重构执行顺序建议

```
Phase 1：P0 页面（首页 + 配置单页）
├── Step 1: 创建 ShaderBackground + ParticleScene
├── Step 2: 重写 HeroSection
├── Step 3: 创建 BentoGrid
├── Step 4: 创建 TrendingToday
├── Step 5: 重写 ToolCard（基于 Card 组件）
├── Step 6: 重写首页 page.tsx（组装新组件）
├── Step 7: 创建 HardwareCenter
├── Step 8: 重写 PCBuildContent
└── Step 9: 重写配置单页 page.tsx

Phase 2：P1 页面（分类页）
├── Step 10: 重写分类页 page.tsx（Section + SectionTitle + Tabs + ToolCard）

Phase 3：P2 页面（投稿 + 联系）
├── Step 11: 重写 SubmitForm（Card + Input + Button + Badge）
└── Step 12: 重写 ContactContent（Card + Button + Badge）

Phase 4：清理
├── 删除：PCBBackground、HotList、PcBuildSelector、CategoryIcon、TagBadge
└── 移除：@phosphor-icons/react 依赖
```

---

## 九、页面状态速查

| 状态 | 页面 |
|------|------|
| ✅ 已就绪（公共组件） | Navbar、Footer、Layout、SearchBar、Button、Card、Input、Badge、Modal、Tabs、Container、Section、SectionTitle |
| 🔄 需重写 | HeroSection、ToolCard、PCBuildContent、SubmitForm、ContactContent、首页 page.tsx、分类页 page.tsx、配置单页 page.tsx |
| 🗑️ 需删除 | PCBBackground、HotList、PcBuildSelector、CategoryIcon、TagBadge |
| ⏳ 需新增 | ShaderBackground、ParticleScene、BentoGrid、TrendingToday、HardwareCenter |

---

*文档生成时间：2025-06-20*  
*基于完整项目扫描和 DESIGN_SYSTEM.md 标准*
*作为页面重构的唯一执行依据*
