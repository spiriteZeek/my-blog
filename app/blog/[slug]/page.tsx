import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getPreviousNextPosts, getRelatedPosts } from '@/lib/posts'
import { generatePostMetadata } from '@/lib/metadata'
import { MDXContent } from '@/components/mdx/mdx-content'
import { TocSidebar } from '@/components/blog/toc-sidebar'
import { PostNav } from '@/components/blog/post-nav'
import { RelatedPosts } from '@/components/blog/related-posts'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return generatePostMetadata(post)
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getPreviousNextPosts(slug)
  const related = getRelatedPosts(post)

  return (
    <div className="py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('zh-CN')}</time>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>{post.category}</span>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <span>{post.metadata.readingTime} 分钟阅读</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-slate-700 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Content + TOC layout */}
      <div className="flex gap-8">
        {/* Article content */}
        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <MDXContent code={post.content} />
        </article>

        {/* TOC sidebar - desktop only */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <TocSidebar toc={post.toc} />
          </div>
        </aside>
      </div>

      {/* Mobile TOC */}
      <div className="mt-8 lg:hidden">
        <TocSidebar toc={post.toc} />
      </div>

      {/* Post navigation */}
      <PostNav prev={prev} next={next} />

      {/* Related posts */}
      <RelatedPosts posts={related} />
    </div>
  )
}
