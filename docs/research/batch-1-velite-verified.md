# Velite 实际 API 验证结果（来源：velite.js.org 官方文档）

## 关键发现（与第一批 agent 的差异）

### ✅ s.toc() 内置支持！
Velite **内置** `s.toc()` schema，自动从文档内容提取 TOC：
```ts
toc: s.toc()
// 返回 TocEntry[]: { title, url, items: TocEntry[] }
```
**结论：不需要自定义 remark 插件来提取 heading！直接用 `s.toc()` 即可。**

### ✅ s.mdx() 输出的是 function-body 字符串
Velite 将 MDX 编译为 function-body 字符串（不是 React 组件）：
```
"const{Fragment:n,jsx:e,jsxs:t}=arguments[0]..."
```
需要用 `new Function()` + `react/jsx-runtime` 渲染：
```tsx
import * as runtime from 'react/jsx-runtime'
const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}
```
**注意：这意味着 MDX 渲染需要客户端组件（`"use client"`），或使用 eval 方案在 RSC 中处理。**

### ✅ s.excerpt() 和 s.metadata() 内置
```ts
summary: s.excerpt()    // 自动从 body 提取摘要，默认 260 字符
metadata: s.metadata()  // 返回 { readingTime, wordCount }
content: s.mdx()        // 编译 MDX 为 function-body
```

## 完整 velite.config.ts 结构

```ts
import { defineConfig, defineCollection, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s.object({
    title: s.string().max(99),
    date: s.isodate(),
    summary: s.excerpt(),         // 自动提取摘要
    content: s.mdx(),             // MDX function-body
    toc: s.toc(),                 // 自动提取 TOC
    metadata: s.metadata(),       // 阅读时间、字数
    tags: s.array(s.string()).min(1),
    category: s.string(),
    draft: s.boolean().default(false),
    coverImage: s.image().optional(),
    slug: s.slug('posts'),
  })
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: false,
    format: 'esm'
  },
  collections: { posts },
  markdown: {
    gfm: true,
    remarkPlugins: [],
    rehypePlugins: []
  },
  mdx: {
    gfm: true,
    remarkPlugins: [],
    rehypePlugins: []        // 这里放 @shikijs/rehype
  },
  prepare: ({ posts }) => {
    // 可以在这里做额外数据处理
  }
})
```

## 与 Next.js 集成方式

推荐：在 `next.config.ts` 中用程序化 API：
```ts
// next.config.ts
const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  import('velite').then(m => m.build({ watch: isDev, clean: !isDev }))
}
```

## .velite/ 输出结构
```
.velite/
  posts.json        # 集合数据（数组）
  index.js          # ESM 入口，re-export 所有集合
  index.d.ts        # TypeScript 类型声明
```
导入方式：`import { posts } from '#content'` 或配置 path alias。

## 完整 s schema API
- `s.isodate()` — 日期字符串 → ISO 日期
- `s.slug(by?, reserved?)` — 验证 slug 格式 + 唯一性
- `s.unique(by?)` — 验证唯一值
- `s.file(options?)` — 复制文件，返回 public URL
- `s.image(options?)` — 复制图片，返回 Image 对象（含 blurDataURL）
- `s.metadata()` — 返回 `{ readingTime, wordCount }`
- `s.excerpt(options?)` — 返回摘要文本（默认 260 字符）
- `s.markdown(options?)` — 编译 Markdown 为 HTML
- `s.mdx(options?)` — 编译 MDX 为 function-body
- `s.raw()` — 返回原始文档内容
- `s.toc(options?)` — 返回 TOC（TocEntry[] 或 TocTree）
- `s.path(options?)` — 返回文件路径
- `s` 也包含所有 Zod 方法

## 注意事项
- Velite 是 ESM-only
- `.velite/` 应加入 `.gitignore`
- Schema 验证在构建时执行
- vfile.data 通过 remark 管线隐式支持，但没有文档化的 API 从 schema 层读取
- `prepare` 钩子可以在写入前修改数据
- `complete` 钩子在构建完成后执行
