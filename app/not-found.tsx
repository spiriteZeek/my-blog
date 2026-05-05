import Link from 'next/link'
import { Container } from '@/components/layout/container'

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">页面未找到</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 cursor-pointer"
      >
        返回首页
      </Link>
    </Container>
  )
}
