import { getPaginatedPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/post-card'
import { Pagination } from '@/components/blog/pagination'
import { generateListMetadata } from '@/lib/metadata'

export function generateMetadata() {
  return generateListMetadata('博客', '所有技术文章')
}

export default function BlogPage() {
  const { list, currentPage, totalPage } = getPaginatedPosts(1)

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">博客</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPage={totalPage} basePath="/blog" />
    </div>
  )
}
