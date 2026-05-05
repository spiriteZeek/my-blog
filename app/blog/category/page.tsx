import { getAllCategories } from '@/lib/posts'
import { generateListMetadata } from '@/lib/metadata'
import Link from 'next/link'

export function generateMetadata() {
  return generateListMetadata('分类', '所有文章分类', '/blog/category')
}

export default function CategoryPage() {
  const categories = getAllCategories()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">分类</h1>
      {categories.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">暂无分类</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map(({ category, count }) => (
            <Link
              key={category}
              href={`/blog/category/${category}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800 cursor-pointer"
            >
              <span className="text-zinc-700 dark:text-zinc-300">{category}</span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">({count})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
