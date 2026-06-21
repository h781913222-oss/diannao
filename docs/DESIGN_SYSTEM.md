# TechVerse Design System

> **版本**：v1.0  
> **来源**：`design/code.txt` — Stitch 设计稿导出代码  
> **适用范围**：TechVerse 项目全部页面  
> **优先级**：高清截图 > Figma > Stitch 代码 > 本设计系统 > 禁止 AI 自主设计

---

## 一、设计原则

1. **唯一数据源**：本文件是项目视觉规范的唯一标准，后续所有页面开发必须严格遵循。
2. **禁止自由设计**：任何未在本文件中定义的样式、颜色、间距、阴影均不得使用。
3. **设计稿优先**：如本文件与高清截图/Figma 存在冲突，以高清截图为准；如本文件与现有代码存在冲突，以本文件为准。
4. **数据层不变**：本文件仅定义视觉表现，不涉及数据结构、接口、业务逻辑。

---

## 二、颜色系统（Color）

颜色命名采用 **Material Design 3** 规范，全部从设计稿 Tailwind 配置提取。

### 2.1 核心使用色（开发中实际使用的颜色）

| 用途 | Token | Hex | 说明 |
|------|-------|-----|------|
| 页面背景 | `background` | `#101415` | 全局 darkest 背景 |
| 卡片/面板背景 | `surface` | `#101415` | 卡片底层，与 background 相同 |
| 卡片 elevated | `surface-elevated` | `#12121a` | 旧系统保留，用于兼容 |
| 卡片 overlay | `surface-overlay` | `#1a1a24` | 旧系统保留，用于兼容 |
| 主要文字 | `on-surface` | `#e0e3e5` | 标题、正文 |
| 次要文字 | `on-surface-variant` | `#cfc4c5` | 描述、辅助信息 |
| 强调色（青蓝） | `tertiary` | `#4cd7f6` | 按钮、链接、高亮、边框装饰 |
| 强调色（紫） | `secondary` | `#ddb7ff` | 次要强调、渐变终点 |
| 主文字渐变 | — | `#e0e3e5 → #4cd7f6` | 标题渐变：从左到右 |
| 边框默认 | `outline` | `#988e90` | 一般边框 |
| 边框变体 | `outline-variant` | `#4c4546` | 弱化边框 |
| 错误 | `error` | `#ffb4ab` | 错误提示 |
| 错误背景 | `error-container` | `#93000a` | 错误容器背景 |
| 选中高亮 | `selection` | `tertiary` | 文字选中背景 `#4cd7f6` |
| 选中文字 | `selection-text` | `on-tertiary` | 文字选中前景 `#003640` |

### 2.2 完整 Material Design 3 色板（供参考）

以下颜色全部注册在 Tailwind `theme.extend.colors` 中，可在任意组件使用：

```typescript
// tailwind.config.ts theme.extend.colors 完整映射
colors: {
  // Surface 层级（从低到高）
  "surface-container-lowest": "#0b0f10",
  "surface-container-low":    "#191c1e",
  "surface-container":        "#1d2022",
  "surface-container-high":   "#272a2c",
  "surface-container-highest": "#323537",
  "surface-bright":           "#363a3b",
  "surface-dim":              "#101415",
  "surface-variant":          "#323537",
  "surface-tint":             "#c6c6c6",

  // Background
  "background":               "#101415",
  "on-background":              "#e0e3e5",

  // Primary（灰/白系）
  "primary":                    "#c6c6c6",
  "on-primary":                 "#303030",
  "primary-container":          "#000000",
  "on-primary-container":       "#757575",
  "primary-fixed":              "#e2e2e2",
  "primary-fixed-dim":          "#c6c6c6",
  "on-primary-fixed":           "#1b1b1b",
  "on-primary-fixed-variant":   "#474747",
  "inverse-primary":            "#5e5e5e",

  // Secondary（紫色系）
  "secondary":                  "#ddb7ff",
  "on-secondary":               "#490080",
  "secondary-container":        "#6f00be",
  "on-secondary-container":     "#d6a9ff",
  "secondary-fixed":            "#f0dbff",
  "secondary-fixed-dim":        "#ddb7ff",
  "on-secondary-fixed":         "#2c0051",
  "on-secondary-fixed-variant": "#6900b3",

  // Tertiary（青蓝色系）
  "tertiary":                   "#4cd7f6",
  "on-tertiary":                "#003640",
  "tertiary-container":         "#000000",
  "on-tertiary-container":      "#008197",
  "tertiary-fixed":             "#acedff",
  "tertiary-fixed-dim":         "#4cd7f6",
  "on-tertiary-fixed":          "#001f26",
  "on-tertiary-fixed-variant":  "#004e5c",

  // Error
  "error":                      "#ffb4ab",
  "on-error":                   "#690005",
  "error-container":            "#93000a",
  "on-error-container":         "#ffdad6",

  // Outline
  "outline":                    "#988e90",
  "outline-variant":            "#4c4546",

  // Inverse
  "inverse-surface":            "#e0e3e5",
  "inverse-on-surface":         "#2d3133",
}
```

### 2.3 颜色使用规则

- **背景**：所有页面使用 `bg-background` (`#101415`)，禁止改变页面底色。
- **文字层级**：标题 `text-on-surface` (#e0e3e5)，描述 `text-on-surface-variant` (#cfc4c5)。
- **强调色**：`tertiary` (#4cd7f6) 用于按钮、链接、图标高亮；`secondary` (#ddb7ff) 用于渐变终点和次要装饰。
- **边框**：默认 `border-outline/10`（约 `rgba(255,255,255,0.08)`），hover 时 `border-outline/20`（约 `rgba(255,255,255,0.15)`）。
- **禁止**：不得使用任何设计稿色板之外的颜色值，不得使用 Tailwind 默认色（如 `blue-500`、`gray-200` 等）。

---

## 三、字体系统（Typography）

### 3.1 字体栈

| 用途 | 字体 | 来源 | 加载方式 |
|------|------|------|---------|
| 显示/标题 | **Geist** | Google Fonts / Vercel | `next/font/google` 或 `next/font/local` |
| 正文 | **Inter** | Google Fonts | `next/font/google` |
| 代码/标签 | **Geist Mono** | Google Fonts / Vercel | `next/font/google` 或 `next/font/local` |

> **Geist 字体加载方案**：
> 1. 首选：`next/font/google` 导入 `Geist` 和 `Geist_Mono`（Next.js 14+ 已支持）。
> 2. 备选：如 `next/font/google` 不支持，将 Geist woff2 文件放入 `public/fonts/`，使用 `next/font/local` 引入。
> 3. 禁止替换为其他字体（如 Inter 替代 Geist 作为标题字体）。

### 3.2 字号定义（Tailwind 扩展）

```typescript
fontSize: {
  "display-xl":  ["72px",  { lineHeight: "80px",  letterSpacing: "-0.04em", fontWeight: "800" }], // Hero 大标题
  "display-lg":  ["48px",  { lineHeight: "56px",  letterSpacing: "-0.03em", fontWeight: "700" }], // 页面标题
  "display-mobile":["36px",  { lineHeight: "44px",  letterSpacing: "-0.02em", fontWeight: "700" }], // 移动端标题
  "headline-md": ["24px",  { lineHeight: "32px",  letterSpacing: "-0.02em", fontWeight: "600" }], // 卡片标题
  "body-lg":     ["18px",  { lineHeight: "28px",  letterSpacing: "0em",     fontWeight: "400" }], // 大段描述
  "body-md":     ["16px",  { lineHeight: "24px",  letterSpacing: "0em",     fontWeight: "400" }], // 正文
  "label-sm":    ["13px",  { lineHeight: "16px",  letterSpacing: "0.05em",  fontWeight: "500" }], // 标签、按钮文字
  "mono-code":   ["14px",  { lineHeight: "20px",  fontWeight: "400" }],                           // 代码、序号、标签
}
```

### 3.3 字体使用规则

| 场景 | 字体 | 字号 Token | 说明 |
|------|------|-----------|------|
| Hero 主标题 | Geist | `display-xl` | 72px，大写，渐变填充 |
| 页面标题 | Geist | `display-lg` | 48px，移动端降级为 `display-mobile` |
| 卡片标题 | Geist | `headline-md` | 24px，semibold |
| 正文描述 | Inter | `body-md` / `body-lg` | 16px / 18px |
| 标签/按钮 | Geist | `label-sm` | 13px，letter-spacing 0.05em，大写 |
| 序号/代码 | Geist Mono | `mono-code` | 14px，如 "01"、"02" |
| 小标签 | Geist Mono | `mono-code` | 14px，如 "#1 AI Tool"、"GPU LEADERBOARD" |

### 3.4 字体族映射（Tailwind fontFamily）

```typescript
fontFamily: {
  "display-xl":    ["var(--font-geist)", "Geist", "sans-serif"],
  "display-lg":    ["var(--font-geist)", "Geist", "sans-serif"],
  "display-mobile":["var(--font-geist)", "Geist", "sans-serif"],
  "headline-md":   ["var(--font-geist)", "Geist", "sans-serif"],
  "body-md":       ["var(--font-inter)", "Inter", "sans-serif"],
  "body-lg":       ["var(--font-inter)", "Inter", "sans-serif"],
  "label-sm":      ["var(--font-geist)", "Geist", "sans-serif"],
  "mono-code":     ["var(--font-geist-mono)", "Geist Mono", "monospace"],
}
```

> 实际使用时，Tailwind 类名：`font-display-xl`、`font-body-md`、`font-mono-code` 等。

---

## 四、间距系统（Spacing）

```typescript
spacing: {
  "unit":           "4px",    // 最小单位
  "gutter-sm":      "16px",   // 小间距
  "gutter-md":      "24px",   // 中间距
  "margin-mobile":  "20px",   // 移动端页面边距
  "margin-desktop": "64px",   // 桌面端页面边距
  "max-width":      "1440px", // 最大内容宽度
}
```

### 4.1 页面边距规则

| 场景 | 移动端 | 桌面端 |
|------|--------|--------|
| 页面内容区 | `px-margin-mobile` (20px) | `px-margin-desktop` (64px) |
| 最大宽度 | `max-w-max-width` (1440px) | 居中 `mx-auto` |

### 4.2 常用间距值

基于 `unit: 4px` 的倍数：

| Tailwind 类 | 值 | 使用场景 |
|-------------|-----|---------|
| `gap-1` | 4px | 微小间距 |
| `gap-2` | 8px | 图标与文字 |
| `gap-3` | 12px | 卡片内小间距 |
| `gap-4` | 16px | 一般间距 |
| `gap-6` | 24px | 卡片网格间距 |
| `gap-8` | 32px | 区块内部间距 |
| `py-24` | 96px | 区块上下 padding（Section 间距） |

### 4.3 区块间距

- **Section 上下间距**：统一使用 `py-24`（96px）。
- **Section 内标题与内容间距**：`mb-12`（48px）。
- **卡片网格间距**：`gap-6`（24px）。
- **卡片内 padding**：`p-6`（24px）或 `p-8`（32px）。

---

## 五、圆角系统（Border Radius）

```typescript
borderRadius: {
  "DEFAULT": "0.125rem",  // 2px  — 极小圆角（标签、小按钮）
  "lg":      "0.25rem",   // 4px  — 小圆角（输入框、小卡片）
  "xl":      "0.5rem",    // 8px  — 中圆角（卡片）
  "full":    "0.75rem",   // 12px — 大圆角（按钮、面板）
}
```

### 5.1 使用规则

| 场景 | 圆角 | 说明 |
|------|------|------|
| 卡片 | `rounded-xl` (8px) | 所有 `glass-panel` 卡片 |
| 按钮 | `rounded-full` (12px) / `rounded-full` (9999px for pills) | 主按钮 12px，pill 按钮完全圆角 |
| 输入框 | `rounded-xl` (8px) | 表单输入框 |
| 标签 pill | `rounded-full` (9999px) | 标签、badge |
| 小图标容器 | `rounded-lg` (4px) | 12×12 图标背景 |

> **注意**：设计稿 Tailwind 配置中 `full: 0.75rem` 是 12px，但在实际 HTML 中使用了 `rounded-full` (9999px) 用于 pill。开发中以实际 HTML 为准：pill 用 `rounded-full` (9999px)，面板/按钮用 `rounded-xl` (8px) 或 `rounded-full` (12px)。

---

## 六、阴影与效果（Shadow & Effects）

### 6.1 Glass Panel（玻璃面板）

**核心组件样式，必须全局统一使用：**

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem; /* 8px */
}
```

**交互状态：**

```css
.glass-panel-interactive:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
```

### 6.2 文字渐变（Text Gradient）

```css
.text-gradient {
  background: linear-gradient(to right, #e0e3e5, #4cd7f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**使用场景**：Hero 大标题、页面标题（如 "Start Your Tech Odyssey"、"Precision Engineered Digital Power"）。

### 6.3 焦点样式（Raycast Focus）

```css
.raycast-focus:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #4cd7f6;
}
```

### 6.4 滚动条隐藏（No Scrollbar）

```css
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**使用场景**：Trending Today 横向滚动区、任何需要隐藏滚动条的容器。

### 6.5 选中高亮（Selection）

```css
::selection {
  background: #4cd7f6;  /* tertiary */
  color: #003640;       /* on-tertiary */
}
```

### 6.6 微光动画（Shimmer）

```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**使用场景**：Hardware Center 的卡片 shimmer 效果。

### 6.7 阴影使用规则

- **禁止使用 Tailwind 默认阴影**（如 `shadow-md`、`shadow-lg`）。
- **玻璃面板阴影**：`glass-panel` 本身不使用外部阴影，hover 时使用 `inset` 内阴影。
- **Hero 内容区阴影**：`shadow-[0_0_100px_rgba(76,215,246,0.1)]`（青蓝色辉光）。
- **卡片底部阴影**：仅用于非 glass-panel 的深色卡片，如 `shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]`。

---

## 七、组件样式（Component Style）

### 7.1 卡片（Card）

**Bento Grid 大卡片（如 AI Tools）：**

```tsx
// 使用 glass-panel + 装饰性 blur 光晕
<a className="glass-panel glass-panel-interactive rounded-xl p-6 flex flex-col justify-between group col-span-1 md:col-span-2 row-span-2 relative overflow-hidden">
  {/* 装饰性光晕 */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors duration-500" />
  {/* 内容 */}
</a>
```

**Bento Grid 小卡片（如 Github Projects）：**

```tsx
<a className="glass-panel glass-panel-interactive rounded-xl p-6 flex flex-col justify-between group relative overflow-hidden">
  <div className="relative z-10">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xl">🚀</span>
      <h3 className="font-label-sm text-label-sm text-white font-medium uppercase tracking-wider">Github Projects</h3>
    </div>
    <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-2">Curated open-source repos.</p>
  </div>
  <div className="relative z-10 self-end mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
    <span className="material-symbols-outlined">code</span>
  </div>
</a>
```

**Trending 横向卡片：**

```tsx
<div className="min-w-[300px] md:min-w-[400px] glass-panel rounded-xl p-6 flex flex-col gap-4 snap-start border-l-2 border-l-tertiary">
  <div className="flex justify-between items-start">
    <div className="bg-surface-variant px-2 py-1 rounded text-xs font-mono-code text-tertiary">#1 AI Tool</div>
    <span className="material-symbols-outlined text-on-surface-variant text-sm">open_in_new</span>
  </div>
  <div>
    <h4 className="font-headline-md text-headline-md text-white">NeuroCraft v2.0</h4>
    <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1 line-clamp-2">...</p>
  </div>
  <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
    <span className="px-2 py-1 bg-white/5 rounded-full text-xs font-mono-code text-on-surface-variant">macOS</span>
  </div>
</div>
```

### 7.2 按钮（Button）

**主按钮（边框 + 渐变 hover）：**

```tsx
<button className="group relative px-8 py-4 rounded-full bg-transparent border border-white text-white font-label-sm overflow-hidden hover:border-tertiary transition-colors duration-300 raycast-focus">
  <div className="absolute inset-0 bg-gradient-to-r from-tertiary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <span className="relative flex items-center gap-2">
    [ Explore Universe ]
    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
  </span>
</button>
```

**次要按钮（半透明背景）：**

```tsx
<button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 font-label-sm transition-all duration-300 raycast-focus backdrop-blur-md">
  [ Start Learning ]
</button>
```

**Get Started 按钮（导航栏）：**

```tsx
<button className="hidden md:flex bg-white/5 border border-white/10 text-on-surface px-6 py-2 rounded-full font-label-sm hover:bg-white/10 hover:border-white/20 transition-all raycast-focus">
  Get Started
</button>
```

### 7.3 Badge / 标签

**页面标题 Badge（如 "Hardware Center Live"）：**

```tsx
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-on-surface-variant">
  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
  Hardware Center Live
</span>
```

**工具标签（如 "#1 AI Tool"）：**

```tsx
<span className="bg-surface-variant px-2 py-1 rounded text-xs font-mono-code text-tertiary">#1 AI Tool</span>
```

**分类标签 pill（如 "macOS"）：**

```tsx
<span className="px-2 py-1 bg-white/5 rounded-full text-xs font-mono-code text-on-surface-variant">macOS</span>
```

### 7.4 导航栏（Navbar）

```tsx
<header className="bg-surface/30 backdrop-blur-xl fixed top-0 w-full z-50 border-b border-white/10">
  <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-max-width mx-auto">
    {/* Logo: 左侧 Geist 字体大标题 */}
    <a className="font-display-lg text-display-lg-mobile md:text-display-lg tracking-tighter text-on-surface hover:opacity-80 transition-opacity" href="/">
      TechVerse
    </a>
    {/* 导航链接 */}
    <nav className="hidden md:flex gap-8 items-center">
      <a className="text-on-surface-variant font-medium hover:text-on-surface transition-colors duration-300" href="/">Discover</a>
      {/* ... */}
    </nav>
    {/* 操作区：搜索 + 通知 + Get Started */}
  </div>
</header>
```

### 7.5 页脚（Footer）

```tsx
<footer className="bg-surface w-full py-12 border-t border-white/5">
  <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto gap-gutter-sm">
    {/* 左侧 Logo + 版权 */}
    <div className="flex flex-col items-center md:items-start gap-2">
      <span className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tighter">TechVerse</span>
      <span className="font-mono-code text-mono-code text-on-surface-variant text-sm">
        © 2024 TechVerse Inc. Built for the next generation.
      </span>
    </div>
    {/* 右侧链接 */}
    <nav className="flex gap-6">
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">Github</a>
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">Discord</a>
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">X</a>
      <a className="font-mono-code text-mono-code text-on-surface-variant hover:text-primary transition-colors">Bilibili</a>
    </nav>
  </div>
</footer>
```

### 7.6 表单输入框（Input）

```tsx
<input
  className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors"
  placeholder="..."
/>
```

**Select 下拉框：**

```tsx
<select className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface outline-none focus:border-tertiary/50 transition-colors appearance-none cursor-pointer">
  {/* options */}
</select>
```

**Textarea：**

```tsx
<textarea
  className="w-full px-5 py-4 bg-white/5 rounded-xl border border-white/10 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-tertiary/50 transition-colors resize-none"
  rows={3}
/>
```

---

## 八、布局规则（Layout Rules）

### 8.1 页面布局骨架

```
<body className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-tertiary selection:text-on-tertiary">
  <header>  {/* 固定顶部导航栏 */}  </header>
  <main className="flex-grow flex flex-col">
    <section>  {/* 区块 1 */}  </section>
    <section>  {/* 区块 2 */}  </section>
    {/* ... */}
  </main>
  <footer>  {/* 页脚 */}  </footer>
</body>
```

### 8.2 Section 布局规则

- **Section 必须包含**：`py-24`（上下 96px 间距），`px-margin-mobile md:px-margin-desktop`（响应式边距）。
- **Section 必须包含**：`max-w-max-width mx-auto`（最大宽度 1440px，居中）。
- **Section 标题区**：`flex flex-col mb-12`，标题 + 渐变下划线 `h-1 w-24 bg-gradient-to-r from-tertiary to-transparent mt-4 rounded-full`。
- **Section 分隔**：使用 `border-t border-white/5` 细线分隔，禁止使用色块切换。

### 8.3 网格布局

**Bento Grid（分类区）：**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
  {/* 大卡片：col-span-1 md:col-span-2 row-span-2 */}
  {/* 小卡片：默认 col-span-1 row-span-1 */}
</div>
```

**工具卡片网格（分类页）：**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 卡片 */}
</div>
```

**Trending 横向滚动：**

```tsx
<div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory">
  {/* 卡片：min-w-[300px] md:min-w-[400px] snap-start */}
</div>
```

### 8.4 响应式断点

| 断点 | Tailwind 前缀 | 布局变化 |
|------|--------------|---------|
| < 768px | 默认（mobile） | 单列，px-margin-mobile (20px) |
| ≥ 768px | `md:` | 多列启动，px-margin-desktop (64px) |
| ≥ 1024px | `lg:` | 4 列 Bento Grid |
| ≥ 1280px | `xl:` | 额外优化 |

### 8.5 Z-Index 层级

| 层级 | 元素 | z-index |
|------|------|---------|
| 背景 | Shader Canvas | z-0 |
| 粒子 | Three.js 粒子 | z-10 |
| 内容 | 页面内容 | z-20 |
| 导航 | Navbar | z-50 |
| 弹层 | 搜索弹层 / Modal | z-[60] |

---

## 九、动画与交互（Animation & Interaction）

### 9.1 允许使用的动画

| 动画 | 来源 | 使用场景 |
|------|------|---------|
| `backdrop-filter: blur(12px)` | glass-panel | 卡片背景模糊 |
| `group-hover:opacity-100` | Tailwind | 卡片 hover 显示图标 |
| `group-hover:translate-x-1` | Tailwind | 按钮箭头 hover 右移 |
| `hover:translateY(-2px)` | glass-panel-interactive | 卡片 hover 上浮 |
| `transition-all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)` | glass-panel-interactive | 卡片 hover 过渡 |
| `animate-bounce` | Tailwind | 滚动指示箭头 |
| `animate-pulse` | Tailwind | badge 绿点闪烁 |
| `shimmer` | 自定义 keyframes | Hardware Center 卡片微光 |
| `whileInView` | Framer Motion | 滚动入场动画（保留现有） |

### 9.2 禁止使用的动画

- 禁止使用 AI 自主设计的动画效果。
- 禁止添加设计稿中没有的新动画（如 3D 翻转、复杂路径动画等）。
- 禁止在卡片上使用 `box-shadow` 外部发光（除非设计稿明确展示）。

### 9.3 过渡时长统一

- **快速交互**（hover、focus）：`duration-200` / `duration-300`
- **内容入场**（whileInView）：`duration-500` / `duration-600`
- **缓动函数**：`cubic-bezier(0.25, 0.8, 0.25, 1)` 或 `cubic-bezier(0.16, 1, 0.3, 1)`

---

## 十、Tailwind 配置汇总（tailwind.config.ts）

以下配置必须完整写入 `tailwind.config.ts` 的 `theme.extend` 中：

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#0b0f10",
        "surface-container-low":    "#191c1e",
        "surface-container":        "#1d2022",
        "surface-container-high":   "#272a2c",
        "surface-container-highest": "#323537",
        "surface-bright":           "#363a3b",
        "surface-dim":              "#101415",
        "surface":                  "#101415",
        "surface-variant":          "#323537",
        "surface-tint":             "#c6c6c6",
        "background":               "#101415",
        "on-background":              "#e0e3e5",
        "on-surface":                 "#e0e3e5",
        "on-surface-variant":         "#cfc4c5",
        "primary":                    "#c6c6c6",
        "on-primary":                 "#303030",
        "primary-container":          "#000000",
        "on-primary-container":       "#757575",
        "primary-fixed":              "#e2e2e2",
        "primary-fixed-dim":          "#c6c6c6",
        "on-primary-fixed":           "#1b1b1b",
        "on-primary-fixed-variant":   "#474747",
        "inverse-primary":            "#5e5e5e",
        "secondary":                  "#ddb7ff",
        "on-secondary":                 "#490080",
        "secondary-container":          "#6f00be",
        "on-secondary-container":       "#d6a9ff",
        "secondary-fixed":              "#f0dbff",
        "secondary-fixed-dim":          "#ddb7ff",
        "on-secondary-fixed":           "#2c0051",
        "on-secondary-fixed-variant":   "#6900b3",
        "tertiary":                     "#4cd7f6",
        "on-tertiary":                  "#003640",
        "tertiary-container":           "#000000",
        "on-tertiary-container":        "#008197",
        "tertiary-fixed":               "#acedff",
        "tertiary-fixed-dim":           "#4cd7f6",
        "on-tertiary-fixed":            "#001f26",
        "on-tertiary-fixed-variant":    "#004e5c",
        "error":                        "#ffb4ab",
        "on-error":                     "#690005",
        "error-container":              "#93000a",
        "on-error-container":           "#ffdad6",
        "outline":                      "#988e90",
        "outline-variant":              "#4c4546",
        "inverse-surface":              "#e0e3e5",
        "inverse-on-surface":           "#2d3133",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg:      "0.25rem",
        xl:      "0.5rem",
        full:    "0.75rem",
      },
      spacing: {
        "margin-mobile":  "20px",
        "margin-desktop": "64px",
        "gutter-sm":      "16px",
        "gutter-md":      "24px",
        "unit":           "4px",
        "max-width":      "1440px",
      },
      fontFamily: {
        "display-xl":     ["var(--font-geist)", "Geist", "sans-serif"],
        "display-lg":     ["var(--font-geist)", "Geist", "sans-serif"],
        "display-mobile": ["var(--font-geist)", "Geist", "sans-serif"],
        "headline-md":    ["var(--font-geist)", "Geist", "sans-serif"],
        "body-md":        ["var(--font-inter)", "Inter", "sans-serif"],
        "body-lg":        ["var(--font-inter)", "Inter", "sans-serif"],
        "label-sm":       ["var(--font-geist)", "Geist", "sans-serif"],
        "mono-code":      ["var(--font-geist-mono)", "Geist Mono", "monospace"],
      },
      fontSize: {
        "display-xl":     ["72px",  { lineHeight: "80px",  letterSpacing: "-0.04em", fontWeight: "800" }],
        "display-lg":     ["48px",  { lineHeight: "56px",  letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-mobile": ["36px",  { lineHeight: "44px",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md":    ["24px",  { lineHeight: "32px",  letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-lg":        ["18px",  { lineHeight: "28px",  letterSpacing: "0em",     fontWeight: "400" }],
        "body-md":        ["16px",  { lineHeight: "24px",  letterSpacing: "0em",     fontWeight: "400" }],
        "label-sm":       ["13px",  { lineHeight: "16px",  letterSpacing: "0.05em",  fontWeight: "500" }],
        "mono-code":      ["14px",  { lineHeight: "20px",  fontWeight: "400" }],
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 十一、全局 CSS 扩展（globals.css 追加）

以下样式必须追加到 `src/app/globals.css` 中（保留现有 `:root` 和基础样式，追加以下部分）：

```css
/* ─── Glassmorphism Utilities ─── */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-panel-interactive:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* ─── Text Gradient ─── */
.text-gradient {
  background: linear-gradient(to right, #e0e3e5, #4cd7f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Focus Style ─── */
.raycast-focus:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #4cd7f6;
}

/* ─── Scrollbar Hide ─── */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* ─── Selection ─── */
::selection {
  background: #4cd7f6;
  color: #003640;
}

/* ─── Shimmer Animation ─── */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 十二、字体加载方案（layout.tsx）

```tsx
import { Inter, Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// 在 <html> 上应用变量
<html lang="zh-CN" className={`dark ${geist.variable} ${geistMono.variable} ${inter.variable}`}>
```

> **备选方案**：如果 `next/font/google` 不支持 `Geist`，将字体文件放入 `public/fonts/`，改用 `next/font/local`：
> ```tsx
> import localFont from 'next/font/local'
> const geist = localFont({
>   src: [
>     { path: '../public/fonts/Geist-Regular.woff2', weight: '400', style: 'normal' },
>     { path: '../public/fonts/Geist-Bold.woff2', weight: '700', style: 'normal' },
>   ],
>   variable: '--font-geist',
> })
> ```

---

## 十三、图标系统

### 13.1 图标来源

- **Lucide React**（现有）：用于一般 UI 图标（搜索、箭头、菜单等）。
- **Material Symbols Outlined**（设计稿使用）：用于设计稿中明确使用的图标（如 `arrow_forward`, `open_in_new`, `memory`, `code`, `terminal` 等）。

### 13.2 使用规则

- 设计稿中使用了 `Material Symbols Outlined` 的图标，优先使用对应 Lucide 图标替代（如 `open_in_new` → `ExternalLink`，`memory` → `Cpu`），保持风格统一。
- 如果设计稿图标无法找到 Lucide 替代，再引入 `Material Symbols Outlined` 字体。
- **禁止混合使用两种图标库在同一组件中**，优先保持 Lucide 一致性。

---

## 十四、禁止事项清单

1. **禁止**使用 Tailwind 默认颜色（`blue-500`、`gray-200`、`slate-900` 等）。
2. **禁止**使用 `box-shadow` 外部阴影（除非本文件明确定义）。
3. **禁止**使用 `rounded-2xl` (16px)、`rounded-3xl` (24px) 等超出设计稿的圆角。
4. **禁止**在 `glass-panel` 上使用 `bg-white/10` 以上的不透明度。
5. **禁止**修改字体为 Geist/Inter/Geist Mono 以外的字体。
6. **禁止**新增设计稿中没有的组件或模块。
7. **禁止**修改数据结构、接口、业务逻辑。
8. **禁止**使用内联 `style={{ ... }}`（特殊情况如动态位置除外）。
9. **禁止**在玻璃卡片上添加外发光或 drop-shadow。
10. **禁止**改变页面布局结构（如增减 Section、改变路由）。

---

*文档生成时间：2025-06-20*  
*基于 design/code.txt 和 4 张高清设计截图提取*  
*作为 TechVerse 项目唯一视觉标准*
