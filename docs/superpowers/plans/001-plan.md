# My Blob 技术博客 - 实施计划

**目标：** 从零搭建个人技术博客，Next.js 15 + Velite + Tailwind CSS 4，全静态生成。

**架构：** Velite 构建时编译 MDX → `.velite/` 类型安全数据层 → Next.js SSG 页面消费。暗色模式用 next-themes + Tailwind `dark:` 前缀。所有页面静态生成，无客户端动态数据获取。

**技术栈：** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Velite (MDX) · @shikijs/rehype · next-themes

---

## 设计规格偏差说明

以下偏差基于 `docs/research/batch-1-velite-verified.md` 的验证结果，比设计规格原方案更优：

| 设计规格原文 | 计划采用 | 理由 |
|-------------|---------|------|
| `summary: s.string().max(999)` | `summary: s.excerpt()` | Velite 内置，自动从 body 提取摘要，无需手写 |
| 自定义 remark 插件提取 heading | `toc: s.toc()` | Velite 内置 TOC 提取，返回 `TocEntry[]`，省掉自定义插件 |
| 无 | `content: s.mdx()` | Velite 编译 MDX 为 function-body 字符串 |
| 无 | `metadata: s.metadata()` | 自动生成阅读时间、字数统计 |

---

## Phase 1: 项目初始化与构建管线

### Task 1.1: Next.js 项目脚手架

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- Create: `app/layout.tsx`, `app/page.tsx`
- Create: `styles/globals.css`
- Create: `.gitignore`

- [ ] 用 `create-next-app` 初始化项目（App Router + TypeScript + Tailwind CSS）
- [ ] 清理默认内容，保留最小 layout + page 骨架
- [ ] 验证 `npm run dev` 正常启动

### Task 1.2: Tailwind CSS 4 配置

**Files:**
- Modify: `styles/globals.css`
- Create: `postcss.config.mjs`

- [ ] `globals.css` 中使用 `@import "tailwindcss"` + `@theme` 定义设计 token

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-mono), Menlo, monospace;
}
```

- [ ] 验证 Tailwind class 正常工作

### Task 1.3: 字体配置

**Files:**
- Modify: `app/layout.tsx`

- [ ] 在 `layout.tsx` 中引入 `next/font/google` 字体

```tsx
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})
```

- [ ] `<html>` 挂载两个 CSS variable class

### Task 1.4: Velite 配置与内容管线

**Files:**
- Create: `velite.config.ts`
- Create: `content/posts/2026-05-04-my-first-post.mdx`
- Modify: `next.config.ts`
- Modify: `.gitignore`

- [ ] 安装 Velite：`npm install velite`
- [ ] 创建 `velite.config.ts`

```ts
import { defineConfig, defineCollection, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s.object({
    title: s.string().max(99),
    date: s.isodate(),
    summary: s.excerpt(),         // 自动从 body 提取摘要
    content: s.mdx(),             // 编译 MDX 为 function-body 字符串
    toc: s.toc(),                 // 自动提取 h2/h3 heading → TocEntry[]
    metadata: s.metadata(),       // 阅读时间 + 字数统计
    tags: s.array(s.string()).min(1),
    category: s.string(),
    draft: s.boolean().default(false),
    slug: s.slug('posts'),
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: false,
    format: 'esm',
  },
  collections: { posts },
  markdown: { gfm: true, remarkPlugins: [], rehypePlugins: [] },
  mdx: { gfm: true, remarkPlugins: [], rehypePlugins: [] },
})
```

- [ ] `next.config.ts` 中集成 Velite 构建钩子（程序化 API，在 dev/build 时触发 `velite.build()`）
- [ ] `.gitignore` 添加 `.velite/`
- [ ] 创建示例 MDX 文章，验证 `npm run build` 正常输出 `.velite/posts.json`
- [ ] 配置 `tsconfig.json` path alias `#content` → `.velite`

### Task 1.5: 代码高亮配置

**Files:**
- Modify: `velite.config.ts`

- [ ] 安装 `@shikijs/rehype`、`remark-gfm`
- [ ] 在 `velite.config.ts` 的 `mdx.rehypePlugins` 中配置 `@shikijs/rehype`

```ts
mdx: {
  gfm: true,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [rehypeShiki, {
      theme: 'github-dark',       // 单主题：SSG 站点在构建时渲染，暗色主题直接输出到 HTML
      grid: true,
    }],
  ],
}
```

> **为什么不使用双主题：** `@shikijs/rehype` 双主题（`themes: { light, dark }`）通过 CSS 类切换亮暗色，依赖 `data-theme` 属性或特定 CSS class。但 next-themes 使用 `.dark` class，两者的切换机制不兼容——暗色模式下代码块可能仍显示亮色主题。SSG 站点无法在构建时动态切换，采用单主题 `github-dark` 更可靠。若后续需要亮色代码块，可在 `globals.css` 中用 CSS filter 反转。

> **fontFamily 备选方案：** 在 `globals.css` 中全局覆盖，最可靠：

```css
pre code {
  font-family: 'JetBrains Mono', Menlo, monospace !important;
}
```

- [ ] 示例文章中添加代码块，验证高亮输出 + 字体生效
- [ ] 验证暗色模式下代码块颜色正确（非亮色主题）

---

## Phase 2: 数据层与通用类型

### Task 2.1: 分页类型定义

**Files:**
- Create: `types/pagination.ts`

```ts
export interface Pagination<T> {
  list: T[]
  total: number
  totalPage: number
  currentPage: number
}
```

### Task 2.2: 文章数据查询层

**Files:**
- Create: `lib/posts.ts`

- [ ] 实现所有公共方法（均默认排除 `draft: true`）

```ts
import { posts } from '#content'
import type { Pagination } from '@/types/pagination'

const PER_PAGE = 10
const published = posts.filter(p => !p.draft)

export function getAllPosts(): Post[]
export function getPostBySlug(slug: string): Post | undefined
export function getPostsByTag(tag: string): Post[]
export function getPostsByCategory(category: string): Post[]
export function getPreviousNextPosts(slug: string): { prev: Post | null; next: Post | null }
export function getRelatedPosts(post: Post, limit?: number): Post[]
export function getAllTags(): { tag: string; count: number }[]
export function getAllCategories(): { category: string; count: number }[]

export function getPaginatedPosts(page: number, perPage = PER_PAGE): Pagination<Post> {
  const total = published.length
  const totalPage = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return {
    list: published.slice(start, start + perPage),
    total,
    totalPage,
    currentPage: page,
  }
}
```

- [ ] 按 `date` 降序排列
- [ ] 边界处理：slug 不存在时返回 undefined，空数组用于标签/分类筛选
- [ ] `getPaginatedPosts` 支持 Task 4.2 分页消费

### Task 2.3: SEO 元数据工具

**Files:**
- Create: `lib/metadata.ts`

```ts
import type { Metadata } from 'next'

const SITE_URL = 'https://my-blob.dev'
const SITE_NAME = 'My Blob'

export function generatePostMetadata(post: Post): Metadata
export function generateListMetadata(title: string, description: string): Metadata
```

- [ ] 每个页面生成 title / description / og:image / canonical URL
- [ ] 统一 openGraph 和 twitter card 配置

### Task 2.4: MDX 渲染组件

**Files:**
- Create: `components/mdx/mdx-content.tsx`

- [ ] 实现 Velite 官方推荐的 MDX 渲染方式

```tsx
import * as runtime from 'react/jsx-runtime'

// 缓存组件引用，避免不必要的重渲染
const componentCache = new Map<string, React.ComponentType>()

const useMDXComponent = (code: string) => {
  const cached = componentCache.get(code)
  if (cached) return cached

  const fn = new Function(code)
  const Component = fn({ ...runtime }).default
  componentCache.set(code, Component)
  return Component
}

interface MDXContentProps {
  code: string
  components?: Record<string, React.ComponentType>
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
```

> **为什么用 `new Function()`：** 这是 Velite 官方推荐的渲染方式（见 velite.js.org/guide/using-mdx）。安全原因——`code` 是构建时从你自己的 MDX 文件生成的 function-body 字符串，不是运行时用户输入。SSG 场景下在 Node.js 构建上下文中执行，可作为 Server Component 使用（不需要 `"use client"`）。

- [ ] 先导出空的 `sharedComponents` 映射，Phase 4 创建 Alert/Callout 后再补全注册

### Task 2.5: Sitemap 与 Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] `sitemap.ts` 导出所有 URL：

```ts
// URL 格式：
// 首页: /
// 文章: /blog/{slug}
// 分页: /blog/p/{page}
// 标签总览: /blog/tags
// 标签归档: /blog/tags/{tag}
// 分类总览: /blog/category
// 分类归档: /blog/category/{category}
// 静态页: /about, /projects, /links
```

- [ ] `robots.ts` 配置允许所有爬虫 + 指向 sitemap URL

---

## Phase 3: 主题系统与布局组件

### Task 3.1: next-themes 集成

**Files:**
- Create: `components/ui/theme-provider.tsx`
- Create: `components/ui/theme-toggle.tsx`
- Modify: `app/layout.tsx`

- [ ] 安装 `next-themes`
- [ ] `theme-provider.tsx`：客户端组件，包裹 `NextThemesProvider`（`attribute="class" defaultTheme="system" enableSystem`）
- [ ] `theme-toggle.tsx`：太阳/月亮 SVG 图标切换，使用 `useTheme()` hook
- [ ] `<html>` 添加 `suppressHydrationWarning`
- [ ] 在根 layout 中包裹 ThemeProvider

### Task 3.2: 布局组件

**Files:**
- Create: `components/layout/container.tsx`
- Create: `components/layout/header.tsx`
- Create: `components/layout/footer.tsx`
- Create: `components/ui/mobile-nav.tsx`

- [ ] `container.tsx`：统一内容容器，`max-w-6xl mx-auto px-4`
- [ ] `header.tsx`：sticky 导航栏，Logo 左 + 导航链接 + 主题切换右
  - 导航项：首页、博客、关于、项目、友链
  - Active 页面指示（下划线）
- [ ] `mobile-nav.tsx`：客户端组件（`"use client"`），汉堡菜单 + slide-out drawer
  - 实现方式：纯 CSS `transform: translateX` + React state 控制开关
  - 触摸目标 ≥ 44px
  - 无需引入 headless UI 库，保持依赖最小化
- [ ] `footer.tsx`：版权信息 + 社交链接
- [ ] 根 layout 组合 Header + Footer

### Task 3.3: 暗色模式 CSS 适配

**Files:**
- Modify: `styles/globals.css`

- [ ] 使用 Tailwind `dark:` 前缀在组件中适配暗色
- [ ] 直接用 Tailwind 内置色值 + `dark:` 覆盖
- [ ] 验证亮/暗色模式下边框、代码块、卡片均可见

---

## Phase 4: 博客核心页面

### Task 4.1: 首页

**Files:**
- Modify: `app/page.tsx`
- Create: `components/blog/post-card.tsx`

- [ ] `PostCard` 组件：标题、日期、摘要、标签，hover 颜色/阴影变化（不用 scale）
- [ ] 首页展示最新 5-10 篇文章卡片
- [ ] 响应式：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### Task 4.2: 博客列表页 + 分页

**Files:**
- Create: `app/blog/page.tsx`（渲染第一页）
- Create: `app/blog/p/[page]/page.tsx`（分页页，`generateStaticParams`）
- Create: `components/blog/pagination.tsx`
- Create: `app/blog/layout.tsx`

> **路由说明：** 使用 `/blog/p/[page]` 而非 `/blog/page/[page]`。虽然 `page` 文件夹和 `page.tsx` 文件在 Next.js 中是不同命名空间，不会冲突，但 `page` 作为路由段可读性差、语义模糊。`/blog/p/2` 更简洁明确，也是 Next.js 社区广泛采用的分页模式。

- [ ] `/blog` 直接渲染第一页文章（不重定向）
- [ ] `app/blog/layout.tsx`：轻量子布局，仅提供 `<Container>` 包裹（max-width + padding），不包含标题栏或面包屑——因为 `/blog/[slug]` 文章详情页也会继承此 layout，标题栏和面包屑由各子页面自行渲染
- [ ] `generateStaticParams` 生成分页路径（每页 10 篇）
- [ ] `Pagination` 组件：页码 + prev/next + "Page X of Y"，截断模式处理大量页码
- [ ] 顶部分类/标签筛选入口

### Task 4.3: 文章详情页

**Files:**
- Create: `app/blog/[slug]/page.tsx`
- Create: `components/blog/toc-sidebar.tsx`
- Create: `components/blog/post-nav.tsx`
- Create: `components/blog/related-posts.tsx`
- Create: `components/mdx/alert.tsx`
- Create: `components/mdx/callout.tsx`

- [ ] MDX 渲染：页面中使用 `MDXContent` 组件（已在 Task 2.4 创建），传入 `post.content` + `components` 映射
- [ ] `Alert` 组件：info/tip/warning/danger 四种类型
- [ ] `Callout` 组件：重点标注
- [ ] TOC 侧边栏（`toc-sidebar.tsx`）：客户端组件（`"use client"`，因为需要 Intersection Observer + 移动端展开/收起交互）
  - 数据来自 `post.toc`（Velite `s.toc()` 自动提取的 `TocEntry[]`，包含 title/url/depth/items）
  - 桌面：sticky 侧边栏，h2/h3 层级，active heading 用 Intersection Observer 高亮
  - 移动端：收起为按钮触发展开
- [ ] 文章布局：桌面双栏（内容 `max-w-prose` + TOC），移动端单栏
- [ ] `post-nav.tsx`：上/下篇导航
- [ ] `related-posts.tsx`：同标签/同分类推荐
- [ ] `generateStaticParams` + `generateMetadata`
- [ ] 在 `mdx-content.tsx` 中补全 `sharedComponents`，注册 Alert 和 Callout

### Task 4.4: 标签与分类归档页

**Files:**
- Create: `app/blog/tags/page.tsx`
- Create: `app/blog/tags/[tag]/page.tsx`
- Create: `app/blog/category/page.tsx`
- Create: `app/blog/category/[category]/page.tsx`
- Create: `components/blog/tag-list.tsx`

- [ ] 标签总览页：所有标签 + 文章数
- [ ] 分类总览页：所有分类 + 文章数
- [ ] 标签/分类归档页：`generateStaticParams` 生成，展示该标签/分类下所有文章
- [ ] `TagList` 组件：标签徽章，可点击跳转

---

## Phase 5: 静态页面

### Task 5.1: 关于页

**Files:**
- Create: `app/about/page.tsx`

- [ ] 个人介绍、技能、经历（直接 JSX）

### Task 5.2: 项目展示页

**Files:**
- Create: `app/projects/page.tsx`
- Create: `components/projects/project-card.tsx`

- [ ] 项目数据定义（名称、描述、技术栈标签、链接）
- [ ] `ProjectCard` 组件
- [ ] 响应式网格布局

### Task 5.3: 友情链接页

**Files:**
- Create: `app/links/page.tsx`

- [ ] 友链列表，数据直接写在组件中

### Task 5.4: 404 页面

**Files:**
- Create: `app/not-found.tsx`

- [ ] 自定义 404 页面，保持站点布局风格
- [ ] 返回首页链接

---

## Phase 6: 交互细节与交付检查

### Task 6.1: 微交互动画

- [ ] 页面切换 fade-in（200ms）
- [ ] 滚动进入 fade-up（150ms，Intersection Observer）
- [ ] Hover 状态：`transition-colors duration-200`
- [ ] `prefers-reduced-motion` 下关闭所有非必要动画

### Task 6.2: 代码块增强

- [ ] 复制按钮：使用 `@shikijs/transformers` 的复制按钮 transformer（实施时确认具体导出名，可能是 `transformerCopyButton`），在 Velite rehype 配置中添加，无需额外客户端组件
- [ ] 行号（Shiki grid 已支持）
- [ ] 行高亮（Shiki syntax `{1,3-5}` 标记）

### Task 6.3: Pre-Delivery 检查

按设计规格 Pre-Delivery Checklist 逐项检查：

- [ ] 视觉质量：无 emoji 图标，SVG 图标 24x24，hover 无 layout shift
- [ ] 交互：`cursor-pointer`，hover 有反馈，过渡 150-300ms，focus 可见
- [ ] 亮/暗色：文本对比度 ≥ 4.5:1，边框两种模式可见
- [ ] 布局：375px / 768px / 1024px / 1440px 响应正常，移动端无水平滚动
- [ ] 无障碍：img 有 alt，颜色不是唯一指示器，尊重 prefers-reduced-motion

---

## 风险评估

| 风险 | 等级 | 缓解策略 |
|------|------|----------|
| 中文 heading slug 生成 | 低 | Velite `s.toc()` 自动处理，若 ID 不理想可用 transliteration 库 |
| @shikijs/rehype 兼容性 | 低 | 备选回退至 `rehype-pretty-code ^0.14.x` + `shiki ^1.x` |
| Tailwind CSS 4 API 变化 | 低 | 已确认 `@theme`/`@custom-variant` 为稳定 API |
| Shiki fontFamily 配置 | 低 | CSS 全局覆盖 `pre code` 作为保底方案 |

## 依赖安装清单

```bash
# 核心依赖
npm install velite next-themes remark-gfm @shikijs/rehype @shikijs/transformers

# 开发依赖
npm install -D @types/node
```
