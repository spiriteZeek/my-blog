import type { MetadataRoute } from 'next'
import { getAllPosts, getAllTags, getAllCategories } from '@/lib/posts'

const SITE_URL = 'https://my-blog.zeek.asia'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const tagUrls: MetadataRoute.Sitemap = tags.map(({ tag }) => ({
    url: `${SITE_URL}/blog/tags/${tag}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const categoryUrls: MetadataRoute.Sitemap = categories.map(({ category }) => ({
    url: `${SITE_URL}/blog/category/${category}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog/tags`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/blog/category`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/links`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  return [...staticUrls, ...postUrls, ...tagUrls, ...categoryUrls]
}
