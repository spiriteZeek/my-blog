import { Container } from '@/components/layout/container'
import { generateListMetadata } from '@/lib/metadata'

export const metadata = generateListMetadata('友链', '友情链接')

const links = [
  { name: 'Example Blog', url: 'https://example.com', description: '一个示例博客' },
]

export default function LinksPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">友链</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 cursor-pointer"
          >
            <h2 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{link.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{link.description}</p>
          </a>
        ))}
      </div>
    </Container>
  )
}
