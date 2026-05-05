import Link from 'next/link'

interface RelatedPostsProps {
  posts: { slug: string; title: string; date: string; tags: string[] }[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">相关文章</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 dark:border-slate-700 dark:hover:border-slate-600 cursor-pointer"
          >
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">{post.title}</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-zinc-500 dark:text-zinc-400">{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
