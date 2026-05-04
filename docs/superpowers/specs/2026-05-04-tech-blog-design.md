# 技术博客设计文档

## 定位

个人技术日志，记录学习笔记、技术踩坑、项目经验。面向自己和同行。

## 技术栈

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | React 生态，渲染模式灵活切换 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS 4 | 原子化 CSS，快速搭建 + 完全可控 |
| 内容 | MDX (gray-matter + next-mdx-remote) | Markdown 写作 + 可嵌入 React 组件 |
| 代码高亮 | Shiki（行号 + 复制按钮） | 主题可定制，与 MDX 集成好 |
| 部署 | Vercel | Next.js 原生支持，零配置 |

**关于 Contentlayer**：暂不采用。原仓库维护停滞，App Router 兼容性不稳定。先在 `lib/posts.ts` 中封装好读取逻辑，对外接口保持干净，后续可随时替换底层实现。

## 项目结构

```
my-blob/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局（导航栏 + 页脚）
│   ├── page.tsx                  # 首页（最新文章列表）
│   ├── blog/
│   │   ├── page.tsx              # 博客列表页（分页 + 分类/标签筛选）
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
│   ├── posts.ts                  # 文章读取、解析、排序、筛选、上下篇、推荐
│   ├── mdx.ts                    # MDX 编译配置、组件注册
│   └── metadata.ts               # 站点元数据、SEO 配置集中管理
├── public/                       # 静态资源（图片等）
├── styles/                       # 全局样式
└── types/                        # TypeScript 类型定义
    └── post.ts                   # Frontmatter 类型接口
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

在 `lib/mdx.ts` 中统一注册所有自定义组件，写文章时可直接使用：
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
- 分页功能

### 标签/分类归档页
- `/blog/tags/[tag]` — 某标签下所有文章
- `/blog/category/[category]` — 某分类下所有文章
- 用于 SEO 和内容导航

### 文章详情页
- MDX 内容渲染
- Shiki 代码高亮（行号 + 复制按钮）
- TOC 目录导航（悬浮侧边栏，长文章友好）
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

## 后续可扩展（当前不实现）

- 全局搜索功能
- RSS 订阅
- 评论系统
- RSS 订阅统计
