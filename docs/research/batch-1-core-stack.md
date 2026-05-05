# 第一批调查：核心依赖选型与配置

## 1. Velite（MDX 内容管理）

### 关键 API
- `defineCollection({ name, pattern, schema })` — 定义内容集合
- `s` 命名空间 — Zod schema 助手（s.string(), s.isodate(), s.slug(), s.array() 等）
- `s.slug('posts')` — 从文件名自动生成 slug
- 输出到 `.velite/` 目录，自动生成 TypeScript 类型

### MDX 处理
- Velite 同时提取 frontmatter 和编译 MDX 为 React 组件
- 在 `velite.config.ts` 中配置 remark/rehype 插件：
  ```ts
  markdown: {
    remark: { plugins: [remarkGfm] },
    rehype: { plugins: [[rehypeShiki, { theme: 'github-dark' }]] }
  }
  ```

### 与 Next.js 集成
- 从 `.velite/` 导入编译后的内容
- `.velite/` 目录应加入 `.gitignore`

### 注意事项
- Schema 验证在构建时执行
- 文件匹配模式大小写敏感
- Slug 生成遵循文件名模式

## 2. Next.js 15 App Router SSG

### generateStaticParams
- 在动态路由的 `page.tsx` 中导出
- 返回参数对象数组，匹配动态段名称
- 构建时静态生成指定路径

### generateMetadata
- 与 generateStaticParams 同文件导出
- 接收 params 对象，返回 Next.js Metadata 对象
- 支持动态 SEO（title, description, og:image）

### sitemap.ts / robots.ts
- 在 `app/` 目录根创建
- sitemap.ts 导出返回 URL 数组的函数
- robots.ts 配置爬虫规则

### next/font/google
- 在 layout.tsx 中导入字体
- 配置 subsets, weight, variable, display
- 通过 CSS variable 注入 Tailwind

### 布局嵌套
- `app/layout.tsx` → `app/blog/layout.tsx` → `app/blog/[slug]/page.tsx`
- Metadata 继承：父 layout 的 metadata 会被子页面扩展/覆盖

## 3. Tailwind CSS 4

### 核心变化
- **完全移除** `tailwind.config.ts`，改为 CSS-first 配置
- 使用 `@theme` 指令在 CSS 中定义设计 token

### 配置方式
```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-mono), Menlo, monospace;
}
```

### 暗色模式
- `dark:` 前缀仍然有效
- 使用 CSS 变量 + `prefers-color-scheme` 或 class-based 切换

### 与 Next.js 集成
- `postcss.config.mjs` 中添加 `@tailwindcss/postcss` 插件
- globals.css 中 `@import "tailwindcss";`

### 兼容性
- `max-w-prose`、`leading-relaxed` 等仍可用
- 框架体积减少 40%
- 自定义 utility 语法可能有变化

## 4. @shikijs/rehype + remark 插件

### 代码高亮配置
```ts
rehypeShiki, {
  themes: { light: 'vitesse-light', dark: 'github-dark' },
  grid: true,  // 行号
  fontFamily: 'JetBrains Mono, Menlo, monospace',
}
```

### vs rehype-pretty-code
- @shikijs/rehype 是官方维护，与 Shiki 核心更好集成
- 更活跃的开发和支持

### 自定义 remark 插件提取 TOC headings
```ts
import { visit } from 'unist-util-visit'

const extractHeadings = () => (tree, file) => {
  const headings = []
  visit(tree, 'heading', (node) => {
    if (node.depth === 2 || node.depth === 3) {
      const text = node.children
        .filter(c => 'value' in c).map(c => c.value).join('')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      headings.push({ depth: node.depth, text, id })
    }
  })
  file.data.headings = headings
}
```
- 通过 `file.data.headings` 传递给页面组件
- 需要处理中文 heading 的 slug 生成（可能需要 transliteration）

### 需要进一步验证
- Velite 是否直接支持 `file.data` 传递（可能需要 vfile data 适配）
- 复制按钮的实现方式（可能是 transformer 而非内置）
