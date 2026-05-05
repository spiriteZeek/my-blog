import type { Metadata } from 'next'

const SITE_URL = 'https://my-blog.zeek.asia'
const SITE_NAME = 'My Blog'

export function generatePostMetadata(post: {
  title: string
  summary: string
  slug: string
}): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      siteName: SITE_NAME,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
    alternates: { canonical: url },
  }
}

export function generateListMetadata(title: string, description: string, path: string = ''): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: { canonical: url },
  }
}
