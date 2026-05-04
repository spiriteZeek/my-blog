# 技术博客设计文档

## 定位

个人技术日志，记录学习笔记、技术踩坑、项目经验。面向自己和同行。

## 技术栈

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | React 生态，渲染模式灵活切换 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS 4 | 原子化 CSS，快速搭建 + 完全可控 |
| 内容 | MDX (gray-matter + next-mdx-remote v5 RSC) | Markdown 写作 + 可嵌入 React 组件，v5 通过 `next-mdx-remote/rsc` 导入，原生支持 App Router RSC |
| 代码高亮 | rehype-pretty-code（基于 Shiki） | 基于 Shiki 的 rehype 插件，与 MDX 管线集成简单，支持行号、行高亮、复制按钮 |
| 部署 | Vercel | Next.js 原生支持，零配置 |

**关于 Contentlayer**：暂不采用。原仓库维护停滞，App Router 兼容性不稳定。先在 `lib/posts.ts` 中封装好读取逻辑，对外接口保持干净，后续可随时替换底层实现。

### Remark/Rehype 插件清单

| 插件 | 用途 |
|------|------|
| remark-gfm | 支持表格、任务列表、自动链接等标准 Markdown 扩展 |
| remark-toc / 自定义 remark 插件 | 提取 h2/h3 heading 节点生成 TOC 目录 |
| rehype-pretty-code（基于 Shiki） | 代码高亮、行号、行高亮、复制按钮 |

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
│   └── posts/                    # MDX 文章存放目录
│       └── my-first-post.mdx
├── components/
│   ├── layout/                   # 布局组件（Header, Footer, Container）
│   ├── blog/                     # 博客相关（PostCard, TagList, Pagination）
│   ├── mdx/                      # MDX 自定义组件（Alert, Callout, XYFlow 等）
│   └── ui/                       # 通用 UI（Button, Badge, ThemeToggle 等）
├── lib/
│   ├── posts.ts                  # 文章读取、解析、排序、筛选、上下篇、推荐（所有公共方法默认过滤 draft: true）
│   ├── mdx.ts                    # MDX 编译配置、组件注册
│   └── metadata.ts               # 站点元数据、SEO 配置集中管理
├── public/                       # 静态资源（图片等）
├── styles/                       # 全局样式
└── types/                        # TypeScript 类型定义
    ├── post.ts                   # Frontmatter 类型接口
    └── pagination.ts             # 通用分页类型
```

## MDX 文章规范

### Frontmatter 类型定义

```typescript
// types/post.ts
interface PostFrontmatter {
  title: string;          // 必填
  date: string;           // 必填，YYYY-MM-DD 格式
  summary: string;        // 必填，文章摘要
  tags: string[];         // 必填，至少一个标签
  category: string;       // 必填，文章分类
  draft?: boolean;        // 可选，true 时构建自动排除
  coverImage?: string;    // 可选，封面图路径
}

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
- 代码高亮（rehype-pretty-code，行号 + 复制按钮）
- TOC 目录导航（悬浮侧边栏，通过 remark 插件提取 MDX AST 中的 h2/h3 heading 节点生成，移动端收起为页面内固定目录）
- 上一篇 / 下一篇文章导航
- 相关文章推荐（同标签 / 同分类）

### 个人介绍页
- 关于我、技能、经历（MDX 或 JSX）

### 项目展示页
- 项目卡片列表（名称、描述、技术栈标签、链接）

### 友情链接页
- 友链列表

## 主题与响应式

- 移动端优先响应式布局
- 亮色 / 暗色模式切换（Tailwind `dark:` 前缀 + 系统偏好检测）
- 文章阅读区固定最大宽度，保证阅读舒适度
- 暗色模式下代码块、MDX 组件样式单独适配

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
