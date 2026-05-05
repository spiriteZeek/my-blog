import { Container } from '@/components/layout/container'
import { generateListMetadata } from '@/lib/metadata'

export const metadata = generateListMetadata('项目', '个人项目展示')

const projects = [
  {
    name: 'My Blob',
    description: '个人技术博客，使用 Next.js + MDX 构建',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
    link: 'https://github.com',
  },
  {
    name: 'Project Alpha',
    description: '一个实验性的全栈项目',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    link: 'https://github.com',
  },
]

export default function ProjectsPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">项目</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
          >
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{project.name}</h2>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{project.description}</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-slate-700 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-pink-500 transition-colors hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 cursor-pointer"
            >
              查看项目 &rarr;
            </a>
          </div>
        ))}
      </div>
    </Container>
  )
}
