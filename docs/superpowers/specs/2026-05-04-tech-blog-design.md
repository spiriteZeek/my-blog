# 技术博客设计文档

## 定位

个人技术日志，记录学习笔记、技术踩坑、项目经验。面向自己和同行。

## 技术栈

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | React 生态，渲染模式灵活切换 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS 4 | 原子化 CSS，快速搭建 + 完全可控 |
| 内容 | Velite | Zod schema 类型安全、RSC 原生支持、构建时校验 frontmatter，替代 gray-matter + next-mdx-remote |
| 代码高亮 | @shikijs/rehype（Shiki 官方 rehype 插件） | Shiki 官方维护，与 MDX 管线集成简单，支持行号、行高亮、复制按钮 |
| 部署 | Vercel | Next.js 原生支持，零配置 |

**关于选型说明：** Velite 替代了 gray-matter + next-mdx-remote 的组合。next-mdx-remote v5 存在高危 RCE 漏洞（CVE-2026-0969），Vercel 已拦截含该版本的部署，v5 不再维护。Velite 使用 Zod schema 定义 frontmatter，构建时自动校验并生成类型安全的数据层，更适合本地 MDX 内容管理。

**代码高亮备选方案：** 若 `@shikijs/rehype` 遇到兼容问题，可回退至 `rehype-pretty-code ^0.14.x`（需锁定 `shiki ^1.x`，注意 rehype-pretty-code 对 Shiki v1+ 的兼容性）。

### Remark/Rehype 插件清单

| 插件 | 用途 |
|------|------|
| remark-gfm | 支持表格、任务列表、自动链接等标准 Markdown 扩展 |
| 自定义 remark 插件 | 遍历 MDX AST 提取 h2/h3 heading 节点，返回给页面渲染悬浮 TOC 侧边栏（非 remark-toc，remark-toc 是插入文档内目录） |
| @shikijs/rehype（Shiki 官方） | 代码高亮、行号、行高亮、复制按钮 |

## 项目结构

```
my-blob/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局（导航栏 + 页脚）
│   ├── page.tsx                  # 首页（最新文章列表）
│   ├── blog/
│   │   ├── page.tsx              # 博客列表页第一页（重定向到 /blog/page/1）
│   │   ├── page/
│   │   │   └── [page]/
│   │   │       └── page.tsx      # 博客列表分页页（generateStaticParams）
│   │   ├── [slug]/
│   │   │   └── page.tsx          # 文章详情页（MDX 渲染 + TOC + 上下篇）
│   │   ├── tags/
│   │   │   ├── page.tsx          # 标签总览页
│   │   │   └── [tag]/
│   │   │       └── page.tsx      # 标签归档页
│   │   └── category/
│   │       ├── page.tsx          # 分类总览页
│   │       └── [category]/
│   │           └── page.tsx      # 分类归档页
│   ├── about/
│   │   └── page.tsx              # 个人介绍页
│   ├── projects/
│   │   └── page.tsx              # 项目展示页
│   └── links/
│       └── page.tsx              # 友情链接页
├── content/
│   └── posts/                    # MDX 文章存放目录（命名规范：YYYY-MM-DD-slug.mdx）
│       └── 2026-05-04-my-first-post.mdx
├── components/
│   ├── layout/                   # 布局组件（Header, Footer, Container）
│   ├── blog/                     # 博客相关（PostCard, TagList, Pagination）
│   ├── mdx/                      # MDX 自定义组件（Alert, Callout, XYFlow 等）
│   └── ui/                       # 通用 UI（Button, Badge, ThemeToggle 等）
├── lib/
│   ├── posts.ts                  # 文章数据查询层（所有公共方法默认过滤 draft: true）
│   ├── mdx.ts                    # MDX 编译配置、组件注册
│   └── metadata.ts               # 站点元数据、SEO 配置集中管理
├── public/                       # 静态资源（图片等）
├── styles/                       # 全局样式
└── types/
    └── pagination.ts             # 通用分页类型（Post 类型由 Velite 自动生成）
```

## MDX 文章规范

### Frontmatter 类型定义（Velite Zod Schema）

```typescript
// velite.config.ts 中定义
import { defineCollection, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: '**/*.mdx',
  schema: s.object({
    title: s.string().max(99),
    date: s.isodate(),
    summary: s.string().max(999),
    tags: s.array(s.string()).min(1),
    category: s.string(),
    draft: s.boolean().default(false),
    coverImage: s.string().optional(),
    slug: s.slug('posts'),        // 从文件名自动生成
  }),
})

export default { collections: { posts } }
```

**文件命名规范：** `content/posts/YYYY-MM-DD-slug.mdx`，slug 部分用于 URL 路径，日期前缀方便文件排序且避免 slug 冲突。

```typescript
// types/pagination.ts
interface Pagination<T> {
  list: T[];
  total: number;
  totalPage: number;
  currentPage: number;
}
```

### 文章示例

```mdx
---
title: "用 React 18 写一个状态管理库"
date: "2026-05-04"
tags: ["React", "状态管理"]
category: "前端"
summary: "从零实现一个轻量状态管理库的思路和实践"
draft: false
---

正文内容...

<Alert type="tip">这是一个提示</Alert>
<FlowChart nodes={[]} edges={[]} />
```

### MDX 组件注册机制

在 `lib/mdx.ts` 中集中导出所有自定义组件，页面渲染 MDX 时统一传 `components` 映射，不搞全局挂载污染，符合 RSC 规范：
- `Alert` — 提示框（info/tip/warning/danger）
- `Callout` — 重点标注
- `FlowChart` — XYFlow 流程图组件（预留）
- 自定义代码块组件（带行号 + 复制按钮）

### lib/posts.ts 公开方法

```typescript
// lib/posts.ts — 所有方法默认排除 draft: true 的文章
getAllPosts(): Post[]                          // 获取全部已发布文章（按日期降序）
getPostBySlug(slug: string): Post              // 根据 slug 获取单篇文章
getPostsByTag(tag: string): Post[]             // 按标签筛选
getPostsByCategory(category: string): Post[]   // 按分类筛选
getPreviousNextPosts(slug: string): { prev: Post | null, next: Post | null }  // 上下篇
getRelatedPosts(post: Post, limit?: number): Post[]  // 相关推荐（同标签/同分类）
getAllTags(): { tag: string, count: number }[]       // 所有标签及文章数
getAllCategories(): { category: string, count: number }[]  // 所有分类及文章数
```

## 页面功能

### 首页
- 最新 5-10 篇文章卡片展示
- 每张卡片显示：标题、日期、摘要、标签

### 博客列表页
- 全部文章列表（排除 draft）
- 顶部分类/标签筛选
- 静态分页（`generateStaticParams` 生成 `/blog/page/[n]`），SEO 友好

### 标签/分类归档页
- `/blog/tags/[tag]` — 某标签下所有文章
- `/blog/category/[category]` — 某分类下所有文章
- 用于 SEO 和内容导航

### 文章详情页
- MDX 内容渲染
- 代码高亮（@shikijs/rehype，行号 + 复制按钮）
- TOC 目录导航（悬浮侧边栏，通过 remark 插件提取 MDX AST 中的 h2/h3 heading 节点生成，移动端收起为页面内固定目录）
- 上一篇 / 下一篇文章导航
- 相关文章推荐（同标签 / 同分类）

### 个人介绍页
- 关于我、技能、经历（MDX 或 JSX）

### 项目展示页
- 项目卡片列表（名称、描述、技术栈标签、链接）

### 友情链接页
- 友链列表

## 视觉设计系统

### 字体方案：Developer Mono

| 用途 | 字体 | 字重 |
|------|------|------|
| 标题 | JetBrains Mono | 400, 500, 600, 700 |
| 正文 | IBM Plex Sans | 300, 400, 500, 600, 700 |
| 代码块 | JetBrains Mono（由 Shiki 渲染） | 400 |

**Shiki 字体配置：** Shiki 默认不会使用页面字体，需在 `@shikijs/rehype` 配置中强制指定：
```typescript
// lib/mdx.ts 中 Shiki 配置
{
  theme: 'github-dark',       // 暗色主题（与暗色模式配合）
  grid: true,                 // 行号对齐
  fontFamily: 'JetBrains Mono, Menlo, monospace',  // 强制使用 JetBrains Mono
}
```

**Next.js 字体引入（使用 next/font/google）：**
```typescript
// app/layout.tsx
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

**Tailwind 配置：**
```typescript
fontFamily: {
  sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'Menlo', 'monospace'],
}
```

**说明：** `next/font/google` 自动处理字体子集化、`font-display: swap`、内联 fallback，无需手动 CSS @import。

### 配色方案

**亮色模式（Magazine/Blog）：**

| 角色 | 色值 | 用途 |
|------|------|------|
| Primary | `#18181B` (zinc-900) | 导航、标题、强调 |
| Secondary | `#3F3F46` (zinc-600) | 副标题、muted 文本 |
| Accent/CTA | `#EC4899` (pink-500) | 按钮、链接高亮、标签 |
| Background | `#FAFAFA` (zinc-50) | 页面背景 |
| Surface | `#FFFFFF` | 卡片、代码块背景 |
| Text | `#09090B` (zinc-950) | 正文文本 |
| Border | `#E4E4E7` (zinc-200) | 边框、分割线 |

**暗色模式（Developer/IDE）：**

| 角色 | 色值 | 用途 |
|------|------|------|
| Primary | `#E4E4E7` (zinc-200) | 导航、标题 |
| Secondary | `#A1A1AA` (zinc-400) | 副标题、muted 文本 |
| Accent/CTA | `#F472B6` (pink-400) | 按钮、链接高亮、标签 |
| Background | `#0F172A` (slate-900) | 页面背景 |
| Surface | `#1E293B` (slate-800) | 卡片、代码块背景 |
| Text | `#F8FAFC` (slate-50) | 正文文本 |
| Border | `#334155` (slate-700) | 边框、分割线 |

### 排版参数

| 参数 | 值 | Tailwind 类 |
|------|----|-------------|
| 正文行高 | 1.625 | `leading-relaxed` |
| 正文行宽 | ~65ch | `max-w-prose` |
| 正文字号 | 16px (1rem) | `text-base` |
| 标题层级 | modular scale: 18→24→30→36px | `text-lg` → `text-2xl` → `text-[30px]` → `text-4xl` |
| 段落间距 | 1.5em | `space-y-6` |

### 动画与交互

- 风格：克制微交互，不使用重动画
- 页面切换：subtle fade-in（200ms）
- 滚动进入：Intersection Observer 驱动的 fade-up（150ms）
- Hover 状态：`transition-colors duration-200`
- **必须** 尊重 `prefers-reduced-motion`：media query 下关闭所有非必要动画
- 不使用 scale 变换作为 hover 效果（避免 layout shift）

## 主题与响应式

- 移动端优先响应式布局
- 亮色 / 暗色模式切换（Tailwind `dark:` 前缀 + 系统偏好检测）
- 文章阅读区固定最大宽度（`max-w-prose`），行高 `leading-relaxed`
- 暗色模式下代码块、MDX 组件样式单独适配
- 所有图标使用 SVG（Heroicons / Lucide），禁止使用 emoji 作为 UI 图标
- 所有可点击元素添加 `cursor-pointer`
- 响应式断点测试：375px、768px、1024px、1440px

## Pre-Delivery Checklist

### 视觉质量
- [ ] 无 emoji 图标（使用 SVG: Heroicons/Lucide）
- [ ] 图标尺寸一致（viewBox 24x24, w-6 h-6）
- [ ] Hover 状态不引起 layout shift
- [ ] 使用主题色直接调用（bg-primary），不包裹 var()

### 交互
- [ ] 所有可点击元素有 `cursor-pointer`
- [ ] Hover 有明确视觉反馈（颜色/阴影/边框）
- [ ] 过渡动画 150-300ms
- [ ] Focus 状态可见（键盘导航）

### 亮/暗色模式
- [ ] 亮色文本对比度 ≥ 4.5:1
- [ ] 半透明/毛玻璃元素在亮色下可见
- [ ] 边框在两种模式下均可见
- [ ] 交付前测试两种模式

### 布局
- [ ] 悬浮元素与边缘有合适间距
- [ ] 无内容被固定导航栏遮挡
- [ ] 375px / 768px / 1024px / 1440px 均响应正常
- [ ] 移动端无水平滚动

### 无障碍
- [ ] 所有图片有 alt 文本
- [ ] 表单输入有 label
- [ ] 颜色不是唯一指示器
- [ ] 尊重 `prefers-reduced-motion`

## SEO 策略

- 每篇文章的 `metadata`（title / description / og:image）从 frontmatter 自动映射，通过 `lib/metadata.ts` 中的 `generatePostMetadata()` 函数生成 Next.js Metadata 对象
- 列表页、归档页同样通过 `generateMetadata` 设置对应的 title 和 description
- 使用 Next.js 内置 `sitemap.ts` 自动生成 sitemap.xml
- 使用 Next.js 内置 `robots.ts` 生成 robots.txt
- 所有页面设置 canonical URL，避免重复内容

## 后续可扩展（当前不实现）

- 全局搜索功能
- RSS 订阅
- 评论系统
- 阅读量统计

## 静态生成策略

所有博客相关页面全部 SSG 静态构建，无客户端动态数据获取：
- 文章列表分页页（`/blog/page/[n]`）
- 文章详情页（`/blog/[slug]`）
- 标签归档页（`/blog/tags/[tag]`）
- 分类归档页（`/blog/category/[category]`）

极致首屏加载速度 + 最优 SEO。
