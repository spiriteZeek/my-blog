import { notFound } from 'next/navigation'
import { getPaginatedPosts, getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/post-card'
import { Pagination } from '@/components/blog/pagination'
import { generateListMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  const { totalPage } = getPaginatedPosts(1)
  return Array.from({ length: totalPage - 1 }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  return generateListMetadata('博客', `所有技术文章 - 第 ${parseInt(page)} 页`)
}

export default async function BlogPaginatedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const pageNum = parseInt(page)
  const { list, currentPage, totalPage } = getPaginatedPosts(pageNum)

  if (pageNum < 1 || pageNum > totalPage) notFound()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">博客 - 第 {pageNum} 页</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPage={totalPage} basePath="/blog" />
    </div>
  )
}
