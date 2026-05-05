import { posts } from '#content'
import type { Pagination } from '@/types/pagination'

type Post = typeof posts[number]

const PER_PAGE = 10
const published = posts.filter((p) => !p.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getAllPosts(): Post[] {
  return published
}

export function getPostBySlug(slug: string): Post | undefined {
  return published.find((p) => p.slug === slug)
}

export function getPostsByTag(tag: string): Post[] {
  return published.filter((p) => p.tags.includes(tag))
}

export function getPostsByCategory(category: string): Post[] {
  return published.filter((p) => p.category === category)
}

export function getPreviousNextPosts(slug: string): { prev: Post | null; next: Post | null } {
  const index = published.findIndex((p) => p.slug === slug)
  return {
    prev: index > 0 ? published[index - 1] : null,
    next: index < published.length - 1 ? published[index + 1] : null,
  }
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return published
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => post.tags.includes(t)).length + (p.category === post.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}

export function getAllTags(): { tag: string; count: number }[] {
  const map = new Map<string, number>()
  for (const post of published) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getAllCategories(): { category: string; count: number }[] {
  const map = new Map<string, number>()
  for (const post of published) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPaginatedPosts(page: number, perPage = PER_PAGE): Pagination<Post> {
  const total = published.length
  const totalPage = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  return {
    list: published.slice(start, start + perPage),
    total,
    totalPage,
    currentPage: page,
  }
}
