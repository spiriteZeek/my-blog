'use client'

import { useEffect, useState } from 'react'
import type { posts } from '#content'

type Post = typeof posts[number]
type TocEntry = Post['toc'][number]

interface TocSidebarProps {
  toc: TocEntry[]
}

export function TocSidebar({ toc }: TocSidebarProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    const observeAll = (items: TocEntry[]) => {
      items.forEach((item) => {
        const el = document.getElementById(item.url.slice(1))
        if (el) observer.observe(el)
        if (item.items?.length) observeAll(item.items)
      })
    }
    observeAll(toc)

    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  const renderItems = (items: TocEntry[], indent = false) => (
    <ul className={`space-y-1.5 text-sm ${indent ? 'mt-1.5 pl-4' : ''}`}>
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            onClick={() => setMobileOpen(false)}
            className={`block cursor-pointer transition-colors ${
              activeId === item.url.slice(1)
                ? 'font-medium text-pink-500 dark:text-pink-400'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            {item.title}
          </a>
          {item.items?.length ? renderItems(item.items, true) : null}
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium lg:hidden dark:border-slate-700 cursor-pointer"
      >
        目录
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-4 w-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* TOC content */}
      <nav className={`${mobileOpen ? 'block' : 'hidden'} lg:block`} aria-label="文章目录">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">目录</h2>
        {renderItems(toc)}
      </nav>
    </>
  )
}
