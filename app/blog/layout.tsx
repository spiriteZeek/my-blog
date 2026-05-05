import { Container } from '@/components/layout/container'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <Container className="py-12">{children}</Container>
}
