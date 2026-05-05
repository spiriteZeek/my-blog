import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CopyScript } from '@/components/ui/copy-script'
import './globals.css'

const ibmPlexSans = localFont({
  src: [
    { path: '../public/fonts/ibm-plex-sans-300.ttf', weight: '300' },
    { path: '../public/fonts/ibm-plex-sans-400.ttf', weight: '400' },
    { path: '../public/fonts/ibm-plex-sans-500.ttf', weight: '500' },
    { path: '../public/fonts/ibm-plex-sans-600.ttf', weight: '600' },
    { path: '../public/fonts/ibm-plex-sans-700.ttf', weight: '700' },
  ],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = localFont({
  src: [
    { path: '../public/fonts/jetbrains-mono-400.ttf', weight: '400' },
    { path: '../public/fonts/jetbrains-mono-500.ttf', weight: '500' },
    { path: '../public/fonts/jetbrains-mono-600.ttf', weight: '600' },
    { path: '../public/fonts/jetbrains-mono-700.ttf', weight: '700' },
  ],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'My Blog',
  description: '个人技术博客，记录学习笔记、技术踩坑、项目经验',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${ibmPlexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 font-sans dark:bg-slate-900 dark:text-slate-50">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CopyScript />
        </ThemeProvider>
      </body>
    </html>
  )
}
