import { getAllTags, getPostsByTag } from '@/lib/posts'
import { PostCard } from '@/components/blog/post-card'
import { generateListMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  return generateListMetadata(`标签: ${tag}`, `标签「${tag}」下的所有文章`, `/blog/tags/${tag}`)
}

export default async function TagArchivePage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">标签: {tag}</h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">{posts.length} 篇文章</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
