import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/blog/post-card'
import { Container } from '@/components/layout/container'

export default function Home() {
  const posts = getAllPosts().slice(0, 10)

  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">My Blog</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">个人技术博客，记录学习笔记、技术踩坑、项目经验</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  )
}
