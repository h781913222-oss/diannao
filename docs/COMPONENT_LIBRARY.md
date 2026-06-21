# TechVerse UI Component Library

> **版本**：v1.0  
> **基础标准**：`docs/DESIGN_SYSTEM.md`（唯一视觉标准）  
> **规则**：所有未来页面必须优先复用本组件库。禁止页面内部重复写UI、禁止创建新的按钮/卡片/颜色/圆角。

---

## 目录

1. [全局 Layout 结构](#1-全局-layout-结构)
2. [Navbar 组件规范](#2-navbar-组件规范)
3. [Footer 组件规范](#3-footer-组件规范)
4. [Button 组件规范](#4-button-组件规范)
5. [Card 组件规范](#5-card-组件规范)
6. [Input 组件规范](#6-input-组件规范)
7. [Modal 组件规范](#7-modal-组件规范)
8. [Tabs 组件规范](#8-tabs-组件规范)
9. [Badge 组件规范](#9-badge-组件规范)
10. [Container/Grid 布局规范](#10-containergrid-布局规范)
11. [页面 Section 规范](#11-页面-section-规范)
12. [现有组件重构清单](#12-现有组件重构清单)
13. [新增组件清单](#13-新增组件清单)

---

## 1. 全局 Layout 结构

### 1.1 页面骨架

```
<body className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary">
  <Navbar />                    <!-- 固定顶部，z-50 -->
  <main className="flex-grow flex flex-col">
    <section id="section-1">    <!-- 区块 1 --></section>
    <section id="section-2">    <!-- 区块 2 --></section>
    <!-- ... -->
  </main>
  <Footer />                    <!-- 底部 -->
</body>
```

### 1.2 现有布局问题

| 问题 | 现有代码 | 标准 | 修正方案 |
|------|---------|------|---------|
| 背景色 | `bg-surface` (#0a0a0f) | `bg-background` (#101415) | 更新 `layout.tsx` 的 body className |
| 字体变量 | `--font-inter`, `--font-jetbrains-mono` | 新增 `--font-geist`, `--font-geist-mono` | 在 `layout.tsx` 中引入 Geist 字体 |
| 语言属性 | `lang="zh-CN"` | 保留 `zh-CN` | 不变，但页面内容可中英混合 |

### 1.3 layout.tsx 规范

```tsx
// src/app/layout.tsx
import { Inter, Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-geist-mono' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`dark ${geist.variable} ${geistMono.variable} ${inter.variable}`}>
      <body className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

---

## 2. Navbar 组件规范

### 2.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/layout/Navbar.tsx` |
| **类型** | Client Component (`'use client'`) |
| **现有状态** | ✅ 已完成重写，符合 DESIGN_SYSTEM.md |

### 2.2 Props 接口

```typescript
interface INavbarProps {
  // 无 props，内部使用 siteConfig 和 CATEGORIES
}
```

### 2.3 设计规范

```tsx
// 视觉规范（来自 design/code.txt）
<header className="bg-surface/30 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10">
  <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-max-width mx-auto">
    {/* Logo：左侧 Geist 字体大标题 */}
    <a className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tighter text-on-surface hover:opacity-80 transition-opacity" href="/">
      TechVerse
    </a>
    {/* 导航链接：Desktop 水平排列，gap-8 */}
    <nav className="hidden md:flex gap-8 items-center">
      {navLinks.map(link => (
        <a className="text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-300" href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
    {/* 操作区：搜索 + 通知 + Get Started 按钮 */}
    <div className="flex items-center gap-4">
      <SearchTrigger />          {/* 搜索触发按钮 */}
      <NotificationBell />         {/* 通知图标 */}
      <GetStartedButton />       {/* 导航栏 Get Started 按钮 */}
      <MobileMenuToggle />         {/* 移动端汉堡菜单 */}
    </div>
  </div>
</header>
```

### 2.4 与现有组件对比

| 维度 | 现有 Navbar | 设计标准 | 重构方案 |
|------|------------|---------|---------|
| **背景** | `glass-strong` 悬浮胶囊 | `bg-surface/30 backdrop-blur-xl` 全宽 | 改为全宽固定导航，取消胶囊包裹 |
| **Logo** | 渐变方块 + Gear 图标 + 文字 | 纯 Geist 字体大标题 "TechVerse" | 移除图标，改为纯文字 Logo |
| **导航链接** | 4 分类 + 配置单（5 个） | Discover / Universe / Creators / Market（4 个） | 映射为 4 个导航项：Discover(/) / Universe(/category/ai) / Creators(/submit) / Market(/pc-build) |
| **搜索** | 带 ⌘K 的搜索按钮 | 搜索输入框（带 placeholder） | 改为搜索输入框 |
| **通知** | 无 | 通知铃铛图标 | 新增（UI 占位，无实际功能） |
| **CTA** | "投稿" 按钮 | "Get Started" 按钮 | 改为 `bg-white/5 border-white/10` 风格按钮 |
| **移动端** | 下拉菜单面板 | 相同，但样式匹配 glass-panel | 保持下拉菜单结构，改用 glass-panel |
| **Framer Motion** | 有入场动画 | 保持 | 保留现有动画 |

### 2.5 导航链接映射

| 设计稿链接 | 目标路由 | 说明 |
|-----------|---------|------|
| Discover | `/` | 首页 |
| Universe | `/category/ai` | AI 工具分类（设计稿 Universe = AI 工具） |
| Creators | `/submit` | 投稿页（设计稿 Creators = 社区/投稿） |
| Market | `/pc-build` | 配置单页（设计稿 Market = 硬件中心） |

### 2.6 重构方案

- **完全重写**：现有 Navbar 的胶囊布局、渐变图标 Logo、Phosphor 图标体系均不符合设计标准。
- **保留内容**：搜索弹层逻辑、移动端菜单切换逻辑、键盘快捷键（⌘K / ESC）。
- **替换内容**：视觉样式、Logo、导航链接、按钮风格、背景效果。
- **新增内容**：通知图标（占位）、搜索输入框（替代搜索按钮）。

---

## 3. Footer 组件规范

### 3.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/layout/Footer.tsx` |
| **类型** | Server Component（无交互，可 SSR） |
| **现有状态** | ❌ 不符合 DESIGN_SYSTEM.md，需完全重写 |

### 3.2 Props 接口

```typescript
interface IFooterProps {
  // 无 props，内部使用 siteConfig
}
```

### 3.3 设计规范

```tsx
<footer className="bg-surface w-full py-12 border-t border-white/5">
  <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto gap-gutter-sm">
    {/* 左侧：Logo + 版权 */}
    <div className="flex flex-col items-center md:items-start gap-2">
      <span className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tighter">
        TechVerse
      </span>
      <span className="font-mono-code text-mono-code text-on-surface-variant text-sm">
        © 2024 TechVerse Inc. Built for the next generation.
      </span>
    </div>
    {/* 右侧：社交链接 */}
    <nav className="flex gap-6">
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">Github</a>
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">Discord</a>
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">X</a>
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">Bilibili</a>
    </nav>
  </div>
</footer>
```

### 3.4 与现有组件对比

| 维度 | 现有 Footer | 设计标准 | 重构方案 |
|------|------------|---------|---------|
| **布局** | 三列（品牌 + 分类导航 + 快速链接） | 单行双列（Logo + 社交链接） | 改为单行布局，去除分类导航和快速链接列 |
| **Logo** | 渐变方块 + Gear 图标 + 文字 | 纯 Geist 字体 "TechVerse" | 移除图标，改为纯文字 |
| **社交链接** | 邮箱/微信/抖音 图标按钮 | Github/Discord/X/Bilibili 文字链接 | 改为设计稿的社交链接 |
| **版权文字** | "© 2025 TechHub. All rights reserved." | "© 2024 TechVerse Inc. Built for the next generation." | 更新文案 |
| **分类导航** | 有 6 个分类链接 | 无 | 删除 |
| **快速链接** | 有配置单/投稿/联系我们 | 无 | 删除（这些链接已分布在导航栏中） |

### 3.5 重构方案

- **完全重写**：布局结构、内容、样式均不符合。
- **保留内容**：无（Footer 是纯展示组件）。
- **替换内容**：全部替换。

---

## 4. Button 组件规范

### 4.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Button.tsx`（**新增文件**） |
| **类型** | Client Component（需要交互） |
| **现有状态** | ⚠️ 不存在独立 Button 组件，现有按钮内联在各页面中 |

### 4.2 Props 接口

```typescript
interface IButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  icon?: React.ReactNode          // 按钮内图标
  iconPosition?: 'left' | 'right' // 图标位置
}
```

### 4.3 变体规范

#### Variant: primary（主按钮 — 边框 + 渐变 hover）

```tsx
<button className="group relative px-8 py-4 rounded-full bg-transparent border border-white text-white font-label-sm overflow-hidden hover:border-tertiary transition-colors duration-300 raycast-focus">
  <div className="absolute inset-0 bg-gradient-to-r from-tertiary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <span className="relative flex items-center gap-2">
    {children}
    {icon && iconPosition === 'right' && (
      <span className="group-hover:translate-x-1 transition-transform">{icon}</span>
    )}
  </span>
</button>
```

**使用场景**：Hero CTA（"[ Explore Universe ]"）、页面主要行动按钮。

#### Variant: secondary（次要按钮 — 半透明背景）

```tsx
<button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 font-label-sm transition-all duration-300 raycast-focus backdrop-blur-md">
  {children}
</button>
```

**使用场景**：Hero 次要按钮（"[ Start Learning ]"）、取消操作。

#### Variant: ghost（幽灵按钮 — 无背景，仅文字）

```tsx
<button className="px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors duration-300 font-medium">
  {children}
</button>
```

**使用场景**：导航链接、文字按钮。

#### Variant: outline（轮廓按钮 — 导航栏 CTA）

```tsx
<button className="hidden md:flex bg-white/5 border border-white/10 text-on-surface px-6 py-2 rounded-full font-label-sm hover:bg-white/10 hover:border-white/20 transition-all raycast-focus">
  {children}
</button>
```

**使用场景**：Navbar "Get Started" 按钮。

#### Variant: danger（危险按钮）

```tsx
<button className="px-6 py-3 rounded-full bg-transparent border border-error text-error font-label-sm hover:bg-error/10 transition-colors duration-300 raycast-focus">
  {children}
</button>
```

**使用场景**：删除操作、取消提交。

### 4.4 Size 规范

| Size | padding | 字体 | 使用场景 |
|------|---------|------|---------|
| sm | `px-4 py-2` | `label-sm` | 小按钮、标签内按钮 |
| md | `px-6 py-3` | `label-sm` | 标准按钮（导航栏 CTA） |
| lg | `px-8 py-4` | `label-sm` | 主按钮（Hero CTA） |

### 4.5 现有按钮内联位置

| 位置 | 现有样式 | 重构方案 |
|------|---------|---------|
| HeroSection "查看装机配置" | `bg-accent text-white glow-hover` | 改为 `Button variant="primary"` |
| PcBuildSelector "咨询装机" | `bg-accent text-white glow-hover` | 改为 `Button variant="primary"` |
| SubmitForm "提交推荐" | `bg-accent text-white glow-hover` | 改为 `Button variant="primary"` |
| ContactContent "预约到店咨询" | `bg-accent text-white glow-hover` | 改为 `Button variant="primary"` |
| Navbar "投稿" | `bg-accent text-white` | 改为 `Button variant="outline"`（即 Get Started） |
| HeroSection "查看全部" | `bg-surface-overlay border-border` | 改为 `Button variant="secondary"` |

### 4.6 重构方案

- **新增组件**：`src/components/ui/Button.tsx`（此前不存在独立 Button 组件）。
- **替换范围**：所有页面中的内联按钮均替换为 `<Button>` 组件。
- **禁止**：页面中禁止再出现 `<button className="...">` 或 `<a className="...">` 作为按钮的内联写法。

---

## 5. Card 组件规范

### 5.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Card.tsx`（**新增文件**） |
| **类型** | 可 SSR 或 Client（根据子内容决定） |
| **现有状态** | ⚠️ 现有 `ToolCard` 不符合设计标准，需完全重写；不存在通用 `Card` 组件 |

### 5.2 Props 接口

```typescript
interface ICardProps {
  variant?: 'default' | 'interactive' | 'trending' | 'horizontal'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  href?: string            // 有 href 时渲染为 <a> 标签
  as?: React.ElementType   // 自定义标签（如 motion.a）
  // 装饰性属性
  glowColor?: 'tertiary' | 'secondary' | 'none'  // 右上角光晕颜色
  leftBorder?: 'tertiary' | 'secondary' | 'none'  // 左侧彩色边框
  shimmer?: boolean         // 是否启用 shimmer 微光
}
```

### 5.3 变体规范

#### Variant: default（默认玻璃卡片）

```tsx
<div className="glass-panel rounded-xl p-6">
  {children}
</div>
```

**使用场景**：表单容器、联系方式卡片、一般内容容器。

#### Variant: interactive（可交互卡片 — hover 上浮）

```tsx
<a className="glass-panel glass-panel-interactive rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
  {/* 装饰性光晕（可选） */}
  {glowColor !== 'none' && (
    <div className={`absolute top-0 right-0 w-64 h-64 bg-${glowColor}/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${glowColor}/20 transition-colors duration-500`} />
  )}
  <div className="relative z-10">{children}</div>
</a>
```

**使用场景**：Bento Grid 分类卡片、工具发现卡片、所有可点击卡片。

#### Variant: trending（Trending 横向卡片）

```tsx
<div className="min-w-[300px] md:min-w-[400px] glass-panel rounded-xl p-6 flex flex-col gap-4 snap-start border-l-2 border-l-tertiary">
  {children}
</div>
```

**使用场景**：首页 Trending Today 横向滚动卡片。

#### Variant: horizontal（横向列表卡片）

```tsx
<a className="group block glass-panel glass-panel-interactive rounded-xl">
  <div className="relative z-10 flex items-center gap-4 p-5">
    {children}
  </div>
</a>
```

**使用场景**：HotList 列表项（如有保留）。

### 5.4 现有卡片对比

| 维度 | 现有 `ToolCard` | 设计标准 | 重构方案 |
|------|---------------|---------|---------|
| **基础样式** | `card gradient-border`（纯黑底 + 顶部渐变边框） | `glass-panel`（半透明 + blur + 细边框） | 完全替换为 `glass-panel` |
| **hover 效果** | `translateY(-4px)` + 阴影 | `translateY(-2px)` + 边框变亮 + inset 阴影 | 改为 `glass-panel-interactive` |
| **圆角** | `rounded-2xl` (16px) | `rounded-xl` (8px) | 减小为 8px |
| **图标容器** | 深色背景 + 边框 | 保持不变（`bg-white/5 border-white/10`） | 更新颜色类名 |
| **标签** | `TagBadge`（圆点 + 文字） | `TagBadge`（但样式需更新） | 更新 `TagBadge` 后复用 |
| **布局** | 横向（图标 + 内容） | 分类页纵向（图片 + 标签 + 标题） | 新增 `variant="interactive"` 支持纵向布局 |

### 5.5 重构方案

- **新增通用 Card 组件**：`src/components/ui/Card.tsx`。
- **重写 ToolCard**：不再独立存在，改为使用 `Card variant="interactive"` + 工具数据渲染的组合。
- **删除现有 card CSS 类**：`globals.css` 中的 `.card`、`.gradient-border` 类在重构后删除。

---

## 6. Input 组件规范

### 6.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Input.tsx`（**新增文件**） |
| **类型** | Client Component（受控组件） |
| **现有状态** | ⚠️ 不存在独立 Input 组件，现有输入框内联在表单中 |

### 6.2 Props 接口

```typescript
interface IInputProps {
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select'
  label?: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  error?: string
  // textarea 专用
  rows?: number
  maxLength?: number
  // select 专用
  options?: { value: string; label: string }[]
}
```

### 6.3 变体规范

#### Type: text / email / url（标准输入框）

```tsx
<div className={className}>
  {label && (
    <label className="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      {icon && <span className="text-on-surface-variant/50">{icon}</span>}
      {label}
      {required && <span className="text-tertiary">*</span>}
    </label>
  )}
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors"
    disabled={disabled}
  />
  {error && <p className="mt-2 text-sm text-error">{error}</p>}
</div>
```

#### Type: textarea（多行文本）

```tsx
<textarea
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
  rows={rows || 3}
  maxLength={maxLength}
  className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors resize-none"
/>
{maxLength && (
  <div className="text-right text-xs text-on-surface-variant mt-2">
    {value.length}/{maxLength}
  </div>
)}
```

#### Type: select（下拉选择）

```tsx
<select
  value={value}
  onChange={(e) => onChange(e.target.value)}
  className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface outline-none focus:border-tertiary/50 transition-colors appearance-none cursor-pointer"
>
  <option value="" className="bg-surface-container">请选择</option>
  {options?.map(opt => (
    <option key={opt.value} value={opt.value} className="bg-surface-container">{opt.label}</option>
  ))}
</select>
```

### 6.4 现有输入框位置

| 位置 | 现有样式 | 重构方案 |
|------|---------|---------|
| SubmitForm 名称输入 | `bg-surface-overlay rounded-xl border-border` | `Input type="text"` |
| SubmitForm 链接输入 | `bg-surface-overlay rounded-xl border-border` | `Input type="url"` |
| SubmitForm 简介输入 | `bg-surface-overlay rounded-xl border-border resize-none` | `Input type="textarea"` |
| SubmitForm 分类选择 | `bg-surface-overlay rounded-xl border-border appearance-none` | `Input type="select"` |
| SubmitForm 理由输入 | `bg-surface-overlay rounded-xl border-border resize-none` | `Input type="textarea"` |
| SubmitForm 联系方式 | `bg-surface-overlay rounded-xl border-border` | `Input type="text"` |
| SearchBar 搜索输入 | `bg-transparent text-text-primary` | `SearchBar` 保持独立，但样式更新 |

### 6.5 重构方案

- **新增组件**：`src/components/ui/Input.tsx`。
- **替换范围**：SubmitForm 中所有输入框替换为 `<Input>` 组件。
- **SearchBar 特殊处理**：SearchBar 保持独立组件，但内部 input 样式更新为 `bg-white/5 border-white/10`。

---

## 7. Modal 组件规范

### 7.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Modal.tsx`（**新增文件**） |
| **类型** | Client Component（需要动画 + 交互） |
| **现有状态** | ⚠️ 不存在独立 Modal 组件，现有搜索弹层内联在 Navbar 和 HeroSection 中 |

### 7.2 Props 接口

```typescript
interface IModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  closeOnEscape?: boolean          // 默认 true
  closeOnBackdropClick?: boolean   // 默认 true
  showCloseButton?: boolean       // 默认 true
}
```

### 7.3 设计规范

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32"
      role="dialog"
      aria-modal="true"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={cn("mx-4 w-full", maxWidthClass)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="mx-auto mt-4 block text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          按 ESC 关闭
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### 7.4 最大宽度映射

| maxWidth | 类名 | 使用场景 |
|----------|------|---------|
| sm | `max-w-sm` | 小提示弹窗 |
| md | `max-w-md` | 确认弹窗 |
| lg | `max-w-lg` | 表单弹窗 |
| xl | `max-w-xl` | 搜索弹层（默认） |
| 2xl | `max-w-2xl` | 大型内容弹窗 |

### 7.5 现有弹层位置

| 位置 | 现有实现 | 重构方案 |
|------|---------|---------|
| Navbar 搜索弹层 | 内联 AnimatePresence + motion.div | 替换为 `<Modal isOpen={isSearchOpen} onClose={closeSearch}>`，内部包裹 `<SearchBar>` |
| HeroSection 搜索弹层 | 同上（重复代码） | 删除 HeroSection 的搜索弹层，统一使用 Navbar 的搜索 |

### 7.6 重构方案

- **新增组件**：`src/components/ui/Modal.tsx`。
- **合并搜索弹层**：Navbar 和 HeroSection 中各有一份搜索弹层代码，重构后统一使用 Modal 组件。
- **HeroSection 搜索**：Hero 区的搜索按钮点击后触发 Navbar 层级的搜索弹层，Hero 本身不再包含弹层。

---

## 8. Tabs 组件规范

### 8.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Tabs.tsx`（**新增文件**） |
| **类型** | Client Component（需要交互状态） |
| **现有状态** | ⚠️ 不存在独立 Tabs 组件，现有预算档位切换内联在 PcBuildSelector 中 |

### 8.2 Props 接口

```typescript
interface ITabItem {
  id: string
  label: string
  description?: string
  content: React.ReactNode
}

interface ITabsProps {
  items: ITabItem[]
  defaultActiveId?: string
  onChange?: (id: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}
```

### 8.3 设计规范

#### Vertical（垂直 — 用于配置单页预算档位）

```tsx
<div className="flex flex-col gap-3">
  {items.map(item => (
    <button
      key={item.id}
      onClick={() => setActiveId(item.id)}
      className={cn(
        "w-full text-left p-5 rounded-xl border transition-all duration-200",
        activeId === item.id
          ? "bg-tertiary/10 border-tertiary/30"
          : "glass-panel hover:bg-white/5 hover:border-white/15"
      )}
    >
      <div className={cn("font-semibold text-base", activeId === item.id ? "text-tertiary" : "text-on-surface")}>
        {item.label}
      </div>
      {item.description && (
        <div className="text-sm text-on-surface-variant mt-1">{item.description}</div>
      )}
    </button>
  ))}
</div>
```

**使用场景**：PcBuildSelector 预算档位切换（左侧列表）、Hardware Center 排名列表。

#### Horizontal（水平 — 用于标签筛选）

```tsx
<div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
  {items.map(item => (
    <button
      key={item.id}
      onClick={() => setActiveId(item.id)}
      className={cn(
        "px-4 py-2 rounded-full font-label-sm transition-all duration-200 whitespace-nowrap",
        activeId === item.id
          ? "bg-white/10 text-on-surface border border-white/20"
          : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
      )}
    >
      {item.label}
    </button>
  ))}
</div>
```

**使用场景**：分类页标签筛选（替代现有 CategoryIcon 的 pill 切换）。

### 8.4 现有切换位置

| 位置 | 现有实现 | 重构方案 |
|------|---------|---------|
| PcBuildSelector 预算档位 | 内联按钮列表 + `selectedBudget` state | 替换为 `<Tabs orientation="vertical" items={budgetTabs}>` |
| 分类页 pill 切换 | `CategoryIcon` 组件 | 移除 `CategoryIcon`，使用 `Tabs orientation="horizontal"` |

### 8.5 重构方案

- **新增组件**：`src/components/ui/Tabs.tsx`。
- **替换 PcBuildSelector**：预算档位切换改为 Tabs 组件。
- **删除 CategoryIcon**：分类页使用 Tabs 组件展示分类，点击后跳转路由。

---

## 9. Badge 组件规范

### 9.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Badge.tsx`（**新增文件**） |
| **类型** | Server Component（纯展示） |
| **现有状态** | ⚠️ 现有 `TagBadge` 不符合设计标准，需重写；不存在通用 `Badge` 组件 |

### 9.2 Props 接口

```typescript
interface IBadgeProps {
  variant?: 'default' | 'category' | 'rank' | 'feature' | 'tag' | 'live'
  children: React.ReactNode
  className?: string
}
```

### 9.3 变体规范

#### Variant: default（默认标签）

```tsx
<span className="px-2 py-1 bg-white/5 rounded-full text-xs font-mono-code text-on-surface-variant">
  {children}
</span>
```

**使用场景**：Trending 卡片底部标签（"macOS", "Windows", "Python" 等）。

#### Variant: category（分类标签）

```tsx
<span className="bg-surface-variant px-2 py-1 rounded text-xs font-mono-code text-tertiary">
  {children}
</span>
```

**使用场景**：Trending 卡片左上角（"#1 AI Tool", "#1 Repo", "Featured Guide"）。

#### Variant: rank（排名标签）

```tsx
<span className="font-mono text-lg font-bold w-8 text-tertiary">
  {children}
</span>
```

**使用场景**：列表排名序号（"01", "02"）。

#### Variant: feature（特性标签）

```tsx
<span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary/10 text-sm text-tertiary font-medium">
  <Check className="w-4 h-4" />
  {children}
</span>
```

**使用场景**：配置单适用场景标签（"日常办公", "2K高帧游戏"）。

#### Variant: tag（标签 pill）

```tsx
<span className="inline-flex items-center px-2 py-1 bg-white/5 rounded-full text-xs font-mono-code text-on-surface-variant">
  {children}
</span>
```

**使用场景**：通用标签（无圆点）。

#### Variant: live（实时状态）

```tsx
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-on-surface-variant">
  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
  {children}
</span>
```

**使用场景**：Hardware Center "Hardware Center Live" badge。

### 9.4 现有 TagBadge 对比

| 维度 | 现有 `TagBadge` | 设计标准 | 重构方案 |
|------|---------------|---------|---------|
| **基础样式** | 圆点 + 文字 + `bg-surface-overlay border-border` | 无圆点，纯文字 + `bg-white/5` | 删除圆点，改为简洁 pill |
| **颜色** | `TAG_DOT_COLORS` 映射（绿/蓝/紫/黄/红） | 统一 `text-on-surface-variant` 或 `text-tertiary` | 移除颜色映射，统一浅色文字 |
| **字体** | 默认 | `font-mono-code` | 改为 Geist Mono |

### 9.5 重构方案

- **新增通用 Badge 组件**：`src/components/ui/Badge.tsx`。
- **重写 TagBadge**：现有 `TagBadge` 改为 `Badge variant="tag"` 的封装，或直接删除 TagBadge 统一使用 Badge。
- **删除 TAG_DOT_COLORS**：`src/constants/index.ts` 中的 `TAG_DOT_COLORS` 映射在重构后删除。

---

## 10. Container/Grid 布局规范

### 10.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Container.tsx`（**新增文件**） |
| **类型** | Server Component（纯布局） |
| **现有状态** | ⚠️ 不存在独立 Container 组件，现有布局内联在各页面中 |

### 10.2 Container 组件

#### Props 接口

```typescript
interface IContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide'
  padding?: 'default' | 'none' | 'mobile-only'
}
```

#### 规范

```tsx
<div className={cn("mx-auto", {
  "max-w-max-width px-margin-mobile md:px-margin-desktop": size === 'default' && padding !== 'none',
  "max-w-4xl px-margin-mobile md:px-margin-desktop": size === 'narrow',
  "max-w-[1600px] px-margin-mobile md:px-margin-desktop": size === 'wide',
  "px-margin-mobile md:px-margin-desktop": padding === 'mobile-only',
}, className)}>
  {children}
</div>
```

| size | max-width | 使用场景 |
|------|-----------|---------|
| default | 1440px | 大多数页面区块 |
| narrow | 896px | 表单页面、窄内容 |
| wide | 1600px | 全宽展示、特殊布局 |

### 10.3 Grid 布局组件

#### BentoGrid（分类网格）

```tsx
interface IBentoGridProps {
  children: React.ReactNode
  className?: string
}

<div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]", className)}>
  {children}
</div>
```

**子项尺寸规则**：
- 大卡片：`col-span-1 md:col-span-2 row-span-2`（如 AI Tools）
- 宽卡片：`col-span-1 md:col-span-2`（如 Hardware Center）
- 标准卡片：默认（1×1）

#### ToolGrid（工具卡片网格）

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {children}
</div>
```

**使用场景**：分类页工具卡片网格、首页 Featured/New Tools 网格。

#### HorizontalScroll（横向滚动）

```tsx
interface IHorizontalScrollProps {
  children: React.ReactNode
  className?: string
  gap?: number
}

<div className={cn("flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory", className)}>
  {children}
</div>
```

**使用场景**：Trending Today 横向滚动区。

### 10.4 现有布局内联位置

| 位置 | 现有内联 | 重构方案 |
|------|---------|---------|
| 所有 `max-w-6xl mx-auto px-4` | 内联在各页面 | 替换为 `<Container>` |
| 所有 `max-w-6xl mx-auto px-6` | 内联在各页面 | 替换为 `<Container>` |
| 分类页 `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | 内联 | 替换为 `<ToolGrid>` |
| 首页 Categories `flex flex-wrap gap-3` | 内联 | 替换为 `<BentoGrid>` |

### 10.5 重构方案

- **新增组件**：`Container.tsx`、`BentoGrid.tsx`、`ToolGrid.tsx`、`HorizontalScroll.tsx`。
- **替换范围**：所有页面中的 `max-w-6xl mx-auto px-4` 和 grid 布局均替换为组件。
- **统一 max-width**：从 1152px (`max-w-6xl`) 提升到 1440px (`max-w-max-width`)。

---

## 11. 页面 Section 规范

### 11.1 组件定义

| 属性 | 说明 |
|------|------|
| **文件路径** | `src/components/ui/Section.tsx`（**新增文件**） |
| **类型** | Server Component（纯布局） |
| **现有状态** | ⚠️ 不存在独立 Section 组件，现有 section 内联在各页面中 |

### 11.2 Props 接口

```typescript
interface ISectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  divider?: 'top' | 'bottom' | 'both' | 'none'  // 默认 'none'
  padding?: 'default' | 'large' | 'hero' | 'none'
  background?: 'default' | 'surface' | 'gradient' | 'transparent'
}
```

### 11.3 规范

```tsx
<section
  id={id}
  className={cn(
    // 背景
    {
      "bg-background": background === 'default',
      "bg-surface": background === 'surface',
      "bg-transparent": background === 'transparent',
    },
    // 间距
    {
      "py-24 px-margin-mobile md:px-margin-desktop": padding === 'default',
      "py-32 px-margin-mobile md:px-margin-desktop": padding === 'large',
      "min-h-screen flex items-center justify-center pt-24 pb-16 px-margin-mobile md:px-margin-desktop": padding === 'hero',
      "": padding === 'none',
    },
    // 分隔线
    {
      "border-t border-white/5": divider === 'top' || divider === 'both',
      "border-b border-white/5": divider === 'bottom' || divider === 'both',
    },
    className
  )}
>
  <Container>
    {children}
  </Container>
</section>
```

### 11.4 Section 标题规范

#### SectionTitle 组件（独立子组件）

```typescript
interface ISectionTitleProps {
  title: React.ReactNode
  subtitle?: string
  badge?: string
  align?: 'left' | 'center' | 'right'
  action?: React.ReactNode    // 右侧按钮（如 "+ SUBMIT ARTIFACT"）
  className?: string
}
```

```tsx
<div className={cn("flex flex-col mb-12", align === 'center' && "items-center text-center", className)}>
  {badge && (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-on-surface-variant mb-4">
      <span className="w-2 h-2 rounded-full bg-tertiary" />
      {badge}
    </span>
  )}
  <h2 className={cn(
    "font-display-lg text-display-mobile md:text-display-lg text-on-surface font-bold tracking-tight",
    typeof title === 'string' && title.includes('gradient') && "text-gradient"
  )}>
    {title}
  </h2>
  {subtitle && (
    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4 leading-relaxed">
      {subtitle}
    </p>
  )}
  <div className="h-1 w-24 bg-gradient-to-r from-tertiary to-transparent mt-4 rounded-full" />
  
  {action && (
    <div className="mt-6 md:mt-0 md:absolute md:right-0 md:top-0">
      {action}
    </div>
  )}
</div>
```

### 11.5 现有 Section 位置

| 位置 | 现有内联 | 重构方案 |
|------|---------|---------|
| 所有 `<section className="py-24 px-4">` | 内联 | 替换为 `<Section>` |
| 所有 `<div className="max-w-6xl mx-auto">` | 内联 | Section 内部自动包裹 Container |
| 所有标题区（h2 + 描述 + 下划线） | 内联 | 替换为 `<SectionTitle>` |
| 所有 divider `<div className="border-t border-border">` | 内联 | 使用 Section 的 `divider` prop |

### 11.6 重构方案

- **新增组件**：`Section.tsx`、`SectionTitle.tsx`。
- **替换范围**：所有页面中的 section 标签和标题区均替换。
- **Hero Section 特殊处理**：Hero 使用 `padding="hero"` + `background="transparent"` + 内部自定义内容（不包裹 Container）。

---

## 12. 现有组件重构清单

### 12.1 完全重写（视觉结构均不符）

| 组件 | 路径 | 问题 | 重构方案 |
|------|------|------|---------|
| **Navbar** | `src/components/layout/Navbar.tsx` | 胶囊布局、渐变图标 Logo、旧颜色体系 | 完全重写，改为全宽 glass 导航 + 文字 Logo |
| **Footer** | `src/components/layout/Footer.tsx` | 三列布局、渐变图标、旧颜色 | 完全重写，改为单行双列 |
| **HeroSection** | `src/components/sections/HeroSection.tsx` | Mesh gradient、PCB 背景、旧颜色、旧按钮 | 完全重写，改为 Shader + 粒子 + Glass Panel |
| **HotList** | `src/components/sections/HotList.tsx` | 纵向列表、旧卡片样式 | 完全重写，改为 Trending Today 横向滚动 |
| **PcBuildSelector** | `src/components/sections/PcBuildSelector.tsx` | 旧卡片样式、旧按钮、旧间距 | 完全重写，改为 Hardware Center 风格 |
| **PCBuildContent** | `src/app/pc-build/PCBuildContent.tsx` | 旧卡片样式、旧按钮、旧间距 | 完全重写，改为 Hardware Center 两列布局 |
| **ToolCard** | `src/components/ui/ToolCard.tsx` | 旧卡片样式（card/gradient-border）、旧颜色 | 完全重写，改为 glass-panel + 纵向/横向布局 |
| **CategoryIcon** | `src/components/ui/CategoryIcon.tsx` | pill 样式不符合 glass-panel | 删除，改为 BentoGrid 内的 Card 组件 |
| **TagBadge** | `src/components/ui/TagBadge.tsx` | 圆点 + 颜色映射，不符合设计稿 | 重写，改为 Badge 组件的封装或删除 |

### 12.2 修改更新（结构保留，样式更新）

| 组件 | 路径 | 问题 | 重构方案 |
|------|------|------|---------|
| **SearchBar** | `src/components/ui/SearchBar.tsx` | 使用 `spotlight` 和旧颜色 | 更新内部样式为 `glass-panel`，颜色改为 `on-surface`/`on-surface-variant`，保持搜索逻辑不变 |
| **SubmitForm** | `src/app/submit/SubmitForm.tsx` | 使用旧卡片和旧输入框样式 | 替换为 Card + Input 组件，表单逻辑不变 |
| **ContactContent** | `src/app/contact/ContactContent.tsx` | 使用旧卡片和旧按钮样式 | 替换为 Card + Button 组件，布局结构不变 |
| **CategoryPage** | `src/app/category/[slug]/page.tsx` | 使用旧卡片和旧样式 | 替换为 Section + SectionTitle + Card 组件，数据逻辑不变 |
| **PCBuildPage** | `src/app/pc-build/page.tsx` | 使用旧组件 | 替换为新的 PCBuildContent，数据逻辑不变 |
| **HomePage** | `src/app/page.tsx` | 使用旧 section 和旧组件 | 替换为新的 Section 组件和新的 section 子组件，数据逻辑不变 |

### 12.3 删除

| 组件 | 路径 | 删除原因 |
|------|------|---------|
| **PCBBackground** | `src/components/sections/PCBBackground.tsx` | 被 ShaderBackground + ParticleScene 替代 |
| **CategoryIcon** | `src/components/ui/CategoryIcon.tsx` | 被 BentoGrid 内的 Card 组件替代 |
| **TagBadge** | `src/components/ui/TagBadge.tsx` | 被 Badge 组件替代（或改为 Badge 的封装） |

### 12.4 保留（无需改动）

| 组件 | 路径 | 原因 |
|------|------|------|
| **queries.ts** | `src/lib/queries.ts` | 数据层，与 UI 无关 |
| **types/index.ts** | `src/types/index.ts` | 数据类型，与 UI 无关 |
| **constants/index.ts** | `src/constants/index.ts` | 常量数据（需删除 TAG_DOT_COLORS，其余保留） |
| **config.ts** | `src/lib/config.ts` | 站点配置（需更新 siteConfig.name 为 "TechVerse"） |
| **supabase.ts** | `src/lib/supabase.ts` | 数据库客户端，与 UI 无关 |
| **utils.ts** | `src/lib/utils.ts` | 工具函数（cn、getFaviconUrl、formatDate），与 UI 无关 |

---

## 13. 新增组件清单

### 13.1 UI 基础组件（src/components/ui/）

| 组件 | 文件 | 来源 | 说明 |
|------|------|------|------|
| **Button** | `Button.tsx` | 新增 | 统一按钮组件，5 个变体 |
| **Card** | `Card.tsx` | 新增 | 统一卡片组件，4 个变体 |
| **Input** | `Input.tsx` | 新增 | 统一输入框组件，5 种类型 |
| **Modal** | `Modal.tsx` | 新增 | 统一弹层组件，支持搜索/表单 |
| **Tabs** | `Tabs.tsx` | 新增 | 统一选项卡组件，支持垂直/水平 |
| **Badge** | `Badge.tsx` | 新增 | 统一标签组件，6 个变体 |
| **Container** | `Container.tsx` | 新增 | 统一内容容器，3 种尺寸 |
| **Section** | `Section.tsx` | 新增 | 统一页面区块，支持背景/分隔线 |
| **SectionTitle** | `SectionTitle.tsx` | 新增 | 统一区块标题（badge + 渐变标题 + 描述） |

### 13.2 布局组件（src/components/layout/）

| 组件 | 文件 | 来源 | 说明 |
|------|------|------|------|
| **Navbar** | `Navbar.tsx` | 重写 | 全宽 glass 导航 |
| **Footer** | `Footer.tsx` | 重写 | 单行双列页脚 |

### 13.3 区块组件（src/components/sections/）

| 组件 | 文件 | 来源 | 说明 |
|------|------|------|------|
| **HeroSection** | `HeroSection.tsx` | 重写 | Shader + 粒子 + Glass Panel |
| **BentoGrid** | `BentoGrid.tsx` | 新增 | Explore Universe 分类网格 |
| **TrendingToday** | `TrendingToday.tsx` | 新增 | 横向滚动 Trending 卡片（替代 HotList） |
| **ShaderBackground** | `ShaderBackground.tsx` | 新增 | WebGL 极光 Shader 背景 |
| **ParticleScene** | `ParticleScene.tsx` | 新增 | Three.js 粒子系统 |
| **HardwareCenter** | `HardwareCenter.tsx` | 新增 | Hardware Center 内容区（替代 PcBuildSelector） |

### 13.4 布局辅助组件（src/components/ui/）

| 组件 | 文件 | 来源 | 说明 |
|------|------|------|------|
| **BentoGrid** | `BentoGrid.tsx` | 新增 | 分类网格容器 |
| **ToolGrid** | `ToolGrid.tsx` | 新增 | 工具卡片网格容器 |
| **HorizontalScroll** | `HorizontalScroll.tsx` | 新增 | 横向滚动容器 |

---

## 14. 依赖变更

### 14.1 新增依赖

```bash
npm install three @types/three
```

> **说明**：Three.js 用于粒子背景。如使用 CDN 方式加载，则不需要 npm 安装。

### 14.2 现有依赖评估

| 依赖 | 状态 | 说明 |
|------|------|------|
| `framer-motion` | ✅ 保留 | 用于动画（Navbar、Modal、Card 入场） |
| `lucide-react` | ✅ 保留 | 图标库（替代 Phosphor Icons） |
| `clsx` | ✅ 保留 | 类名合并 |
| `tailwind-merge` | ✅ 保留 | Tailwind 类名合并 |
| `next/font/google` | ✅ 更新 | 新增 Geist 和 Geist_Mono 字体 |
| `phosphor-icons/react` | ⚠️ 移除 | 全部替换为 `lucide-react` |

---

## 15. 图标迁移规范

### 15.1 Phosphor → Lucide 映射

| Phosphor Icon | Lucide Icon | 使用位置 |
|--------------|-------------|---------|
| `MagnifyingGlass` | `Search` | 搜索按钮、搜索框 |
| `ArrowUpRight` | `ArrowUpRight` | 卡片外部链接 |
| `TrendUp` | `TrendingUp` | 查看全部按钮 |
| `Flame` | `Flame` | 热榜标题 |
| `Cpu` | `Cpu` | 配置单标题 |
| `Check` | `Check` | 特性标签 |
| `ArrowRight` | `ArrowRight` | 按钮箭头 |
| `Sparkle` | `Sparkles` | 投稿按钮 |
| `PaperPlaneTilt` | `Send` | 提交表单 |
| `Warning` | `AlertTriangle` | 错误提示 |
| `EnvelopeSimple` | `Mail` | 邮箱图标 |
| `ChatCircle` | `MessageCircle` | 微信图标 |
| `MusicNote` | `Music` | 抖音图标 |
| `MapPin` | `MapPin` | 地址图标 |
| `Clock` | `Clock` | 时间图标 |
| `List` | `Menu` | 菜单按钮 |
| `X` | `X` | 关闭按钮 |
| `Gear` | `Settings` | 旧 Logo 图标（删除） |
| `Command` | `Command` | 快捷键提示 |
| `ArrowSquareOut` | `ExternalLink` | 搜索外部链接 |
| `LinkSimple` | `Link` | 链接图标 |
| `FileText` | `FileText` | 文件图标 |
| `Tag` | `Tag` | 标签图标 |
| `User` | `User` | 用户图标 |
| `MonitorPlay` | `Monitor` | 显示器图标 |

### 15.2 迁移规则

1. 所有 `import { ... } from '@phosphor-icons/react'` 替换为 `import { ... } from 'lucide-react'`。
2. 移除 `@phosphor-icons/react` 依赖。
3. 保留 `Material Symbols Outlined`（如设计稿中明确使用了 `material-symbols-outlined` 类名，但优先用 Lucide 替代）。

---

## 16. 文件结构变更总结

### 重构后文件结构

```
src/
├── app/
│   ├── page.tsx                    # 重写：使用新 Section + 新子组件
│   ├── layout.tsx                  # 更新：字体变量 + body className
│   ├── globals.css                 # 更新：删除旧样式，添加 glass-panel 等
│   ├── category/[slug]/page.tsx    # 修改：使用新组件
│   ├── pc-build/page.tsx           # 修改：使用新 PCBuildContent
│   ├── pc-build/PCBuildContent.tsx  # 重写：Hardware Center 风格
│   ├── submit/page.tsx             # 修改：使用新组件
│   ├── submit/SubmitForm.tsx       # 修改：使用 Input + Button + Card
│   ├── contact/page.tsx            # 修改：使用新组件
│   └── contact/ContactContent.tsx  # 修改：使用 Card + Button
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # 重写
│   │   └── Footer.tsx              # 重写
│   ├── ui/                         # 基础 UI 组件库
│   │   ├── Button.tsx              # 新增
│   │   ├── Card.tsx                # 新增
│   │   ├── Input.tsx               # 新增
│   │   ├── Modal.tsx               # 新增
│   │   ├── Tabs.tsx                # 新增
│   │   ├── Badge.tsx               # 新增
│   │   ├── Container.tsx           # 新增
│   │   ├── Section.tsx             # 新增
│   │   ├── SectionTitle.tsx        # 新增
│   │   ├── BentoGrid.tsx           # 新增
│   │   ├── ToolGrid.tsx            # 新增
│   │   ├── HorizontalScroll.tsx    # 新增
│   │   ├── SearchBar.tsx           # 修改：样式更新
│   │   ├── ToolCard.tsx            # 重写：基于 Card 组件
│   │   ├── CategoryIcon.tsx        # 删除
│   │   └── TagBadge.tsx            # 删除（或改为 Badge 封装）
│   └── sections/                   # 页面区块组件
│       ├── HeroSection.tsx         # 重写
│       ├── BentoGrid.tsx           # 新增（与 ui/BentoGrid 区分？）
│       ├── TrendingToday.tsx       # 新增（替代 HotList）
│       ├── ShaderBackground.tsx    # 新增
│       ├── ParticleScene.tsx       # 新增
│       ├── HardwareCenter.tsx      # 新增（替代 PcBuildSelector）
│       ├── PcBuildSelector.tsx     # 删除
│       ├── HotList.tsx             # 删除
│       └── PCBBackground.tsx       # 删除
├── lib/
│   ├── queries.ts                  # 保留
│   ├── supabase.ts                 # 保留
│   ├── utils.ts                    # 保留
│   └── config.ts                   # 修改：更新 name 为 "TechVerse"
├── types/
│   └── index.ts                    # 保留
├── constants/
│   └── index.ts                    # 修改：删除 TAG_DOT_COLORS，更新 SITE_NAME
└── docs/
    ├── DESIGN_SYSTEM.md            # 已有
    └── COMPONENT_LIBRARY.md      # 本文档
```

> **BentoGrid 命名冲突**：`components/ui/BentoGrid.tsx`（布局容器）和 `components/sections/BentoGrid.tsx`（Explore Universe 内容区块）可以合并为一个，或分别命名为 `BentoGrid` 和 `ExploreUniverse`。

---

## 17. 执行顺序建议

### Phase 1：设计系统基建（先不动页面）
1. 更新 `tailwind.config.ts`（颜色、字体、间距、圆角）
2. 更新 `globals.css`（添加 glass-panel、text-gradient、删除旧样式）
3. 更新 `layout.tsx`（字体变量、body className）
4. 更新 `config.ts`（siteConfig.name → "TechVerse"）
5. 更新 `constants/index.ts`（删除 TAG_DOT_COLORS，更新 SITE_NAME）

### Phase 2：基础 UI 组件库（先不动页面）
6. 创建 `Button.tsx`
7. 创建 `Card.tsx`
8. 创建 `Input.tsx`
9. 创建 `Badge.tsx`
10. 创建 `Modal.tsx`
11. 创建 `Tabs.tsx`
12. 创建 `Container.tsx`、`Section.tsx`、`SectionTitle.tsx`
13. 创建 `BentoGrid.tsx`、`ToolGrid.tsx`、`HorizontalScroll.tsx`

### Phase 3：布局组件（先不动页面）
14. 重写 `Navbar.tsx`
15. 重写 `Footer.tsx`

### Phase 4：区块组件（先不动页面）
16. 创建 `ShaderBackground.tsx`
17. 创建 `ParticleScene.tsx`
18. 重写 `HeroSection.tsx`
19. 创建 `TrendingToday.tsx`（替代 HotList）
20. 创建 `HardwareCenter.tsx`（替代 PcBuildSelector）
21. 重写 `ToolCard.tsx`（基于 Card 组件）

### Phase 5：页面更新
22. 重写 `HomePage`（使用新 Section + 新子组件）
23. 更新 `CategoryPage`
24. 更新 `PCBuildPage` + `PCBuildContent`
25. 更新 `SubmitPage` + `SubmitForm`
26. 更新 `ContactPage` + `ContactContent`

### Phase 6：清理
27. 删除废弃组件（PCBBackground、HotList、PcBuildSelector、CategoryIcon、TagBadge）
28. 移除 `phosphor-icons/react` 依赖
29. 验证所有页面无编译错误

---

*文档生成时间：2025-06-20*  
*基于 DESIGN_SYSTEM.md 和现有组件全面分析*  
*作为 TechVerse 项目组件开发唯一标准*
