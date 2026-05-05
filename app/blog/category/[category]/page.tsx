import { getAllCategories, getPostsByCategory } from '@/lib/posts'
import { PostCard } from '@/components/blog/post-card'
import { generateListMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return generateListMetadata(`分类: ${category}`, `分类「${category}」下的所有文章`, `/blog/category/${category}`)
}

export default async function CategoryArchivePage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const posts = getPostsByCategory(category)

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">分类: {category}</h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">{posts.length} 篇文章</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
