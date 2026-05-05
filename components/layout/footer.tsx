import { Container } from './container'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-8 dark:border-slate-700">
      <Container className="flex flex-col items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
          >
            GitHub
          </a>
        </div>
      </Container>
    </footer>
  )
}
