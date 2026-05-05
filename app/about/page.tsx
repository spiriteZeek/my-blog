import { Container } from '@/components/layout/container'
import { generateListMetadata } from '@/lib/metadata'

export const metadata = generateListMetadata('关于', '关于我')

export default function AboutPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">关于我</h1>

      <div className="max-w-prose space-y-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>你好，欢迎来到我的技术博客。</p>

        <p>我是一名热爱技术的开发者，平时喜欢探索新技术、记录学习笔记、分享项目经验。</p>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">技能</h2>
        <div className="flex flex-wrap gap-2">
          {['TypeScript', 'React', 'Next.js', 'Node.js', 'Go', 'PostgreSQL'].map((skill) => (
            <span key={skill} className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-slate-800">
              {skill}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">联系方式</h2>
        <p>你可以通过以下方式找到我：</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>GitHub</li>
          <li>Twitter / X</li>
          <li>Email</li>
        </ul>
      </div>
    </Container>
  )
}
