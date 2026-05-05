import Link from 'next/link'

interface PostCardProps {
  post: {
    title: string
    slug: string
    date: string
    summary: string
    tags: string[]
    category: string
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600">
      <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
        <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('zh-CN')}
          </time>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>{post.category}</span>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-zinc-900 transition-colors group-hover:text-pink-500 dark:text-zinc-100 dark:group-hover:text-pink-400">
          {post.title}
        </h2>
        <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {post.summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-slate-700 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  )
}
