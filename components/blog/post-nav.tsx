import Link from 'next/link'

interface PostNavProps {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 flex gap-4 border-t border-zinc-200 pt-8 dark:border-slate-700">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="flex-1 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 dark:border-slate-700 dark:hover:border-slate-600 cursor-pointer"
        >
          <span className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">上一篇</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{prev.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="flex-1 rounded-lg border border-zinc-200 p-4 text-right transition-colors hover:border-zinc-300 dark:border-slate-700 dark:hover:border-slate-600 cursor-pointer"
        >
          <span className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">下一篇</span>
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{next.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}
