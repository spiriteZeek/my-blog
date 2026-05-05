import Link from 'next/link'

interface TagListProps {
  items: { tag: string; count: number }[]
  basePath: string
}

export function TagList({ items, basePath }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.tag}
          href={`${basePath}/${item.tag}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800 cursor-pointer"
        >
          <span className="text-zinc-700 dark:text-zinc-300">{item.tag}</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">({item.count})</span>
        </Link>
      ))}
    </div>
  )
}
