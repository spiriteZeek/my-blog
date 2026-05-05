# 第二批调查：主题切换与布局模式

## 1. 暗色/亮色主题切换

### 推荐方案：next-themes
- 安装：`npm install next-themes`
- 自动处理 localStorage 持久化 + 系统偏好检测
- 注入 inline script 防止 "flash of wrong theme"

### Tailwind CSS 4 暗色模式
- **不再需要** `darkMode: 'class'` 配置
- 使用 `@custom-variant dark (&:where(.dark, .dark *))` 在 CSS 中定义
- CSS 变量方案：
  ```css
  :root {
    --background-primary: #FAFAFA;
    --text-primary: #09090B;
  }
  .dark {
    --background-primary: #0F172A;
    --text-primary: #F8FAFC;
  }
  @theme inline {
    --color-backgroundPrimary: var(--background-primary);
    --color-textPrimary: var(--text-primary);
  }
  ```

### ThemeProvider 组件
- 客户端组件（`"use client"`）
- 用 `useEffect` + `mounted` 状态防止 hydration mismatch
- `<html suppressHydrationWarning>` 防止 next-themes 注入时的警告
- `<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>`

### ThemeToggle 组件
- 使用 next-themes 的 `useTheme()` hook
- SVG 图标切换（太阳/月亮图标）
- 尊重 `prefers-reduced-motion`

## 2. 响应式博客布局模式

### 文章卡片
- 布局：CSS Grid 外层容器 + Flexbox 卡片内部
- 响应式：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 卡片内容：封面图 + 标题 + 日期 + 摘要 + 标签
- Hover：颜色/阴影变化，不用 scale（避免 layout shift）

### 分页
- `generateStaticParams` 预生成 `/blog/page/[n]`
- UI 模式：页码数字 + prev/next 按钮 + "Page X of Y"
- 截断模式：`1 ... 5 6 7 ... 20`（大量页码时）

### TOC 侧边栏
- **桌面**：sticky 侧边栏，显示 h2/h3
- **移动端**：收起为按钮触发或文章底部展开
- Active heading 用 Intersection Observer 检测
- heading 数据通过 remark 插件提取，作为 props 传递

### 文章详情页布局
- 桌面：双栏 — 文章内容（max-w-prose 居中）+ TOC 侧边栏
- 移动端：单栏，TOC 收起
- 底部：上/下篇导航 + 相关推荐（同标签/分类）

### 导航栏
- Sticky header：Logo 左 + 导航链接中/右 + 主题切换右
- 移动端：汉堡菜单 + slide-out drawer
- Active 页面：下划线或加粗指示
- 触摸目标最小 44px

### 标签/分类
- 静态归档页 `/blog/tags/[tag]` 用 `generateStaticParams`
- 标签云或列表组件
- 移动端：简化列表或下拉选择
