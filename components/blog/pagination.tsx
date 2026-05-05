import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPage: number
  basePath: string
}

export function Pagination({ currentPage, totalPage, basePath }: PaginationProps) {
  if (totalPage <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPage <= 7) {
    for (let i = 1; i <= totalPage; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPage - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPage - 2) pages.push('...')
    pages.push(totalPage)
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="分页导航">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}/p/${currentPage - 1}`}
          className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
        >
          上一页
        </Link>
      )}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-zinc-400">...</span>
        ) : (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}/p/${page}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors cursor-pointer ${
              page === currentPage
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-200 hover:bg-zinc-50 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPage && (
        <Link
          href={`${basePath}/p/${currentPage + 1}`}
          className="inline-flex h-9 items-center rounded-lg border border-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
        >
          下一页
        </Link>
      )}
    </nav>
  )
}
