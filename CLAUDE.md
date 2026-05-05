# My Blog - 个人技术博客

## 项目概述

个人技术博客，记录学习笔记、技术踩坑、项目经验。使用 Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Velite MDX 构建。

## 设计规范

所有 UI/UX 实现必须遵循以下设计规格文档：

- [技术博客设计规格](docs/superpowers/specs/2026-05-04-tech-blog-design.md)

### 关键设计约束

- 移动端优先响应式布局
- 亮色/暗色模式切换（Tailwind `dark:` 前缀 + 系统偏好检测）
- 文章阅读区限制行宽（`max-w-prose`），行高 `leading-relaxed`
- 所有页面 SSG 静态生成，无客户端动态数据获取

## UI/UX 设计

使用 `ui-ux-pro-max` skill 辅助设计决策。涉及 UI 组件、配色、字体、布局时，先用 skill 的 `--design-system` 生成建议，再结合设计规格文档做出选择。

```bash
# 生成设计系统
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<描述>" --design-system -p "My Blog"

# 查询具体领域（typography, color, ux, style, landing 等）
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<关键词>" --domain <domain>

# 查询技术栈指南（nextjs, html-tailwind）
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<关键词>" --stack <stack>
```

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| 内容 | Velite (MDX, Zod schema 类型安全) |
| 代码高亮 | @shikijs/rehype |
| 部署 | Vercel |
