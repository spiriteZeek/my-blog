import { getAllTags } from '@/lib/posts'
import { TagList } from '@/components/blog/tag-list'
import { generateListMetadata } from '@/lib/metadata'

export function generateMetadata() {
  return generateListMetadata('标签', '所有文章标签', '/blog/tags')
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">标签</h1>
      {tags.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">暂无标签</p>
      ) : (
        <TagList items={tags} basePath="/blog/tags" />
      )}
    </div>
  )
}
