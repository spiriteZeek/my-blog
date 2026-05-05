import * as runtime from 'react/jsx-runtime'
import { Alert } from './alert'
import { Callout } from './callout'

const componentCache = new Map<string, React.ComponentType>()

const useMDXComponent = (code: string) => {
  const cached = componentCache.get(code)
  if (cached) return cached

  const fn = new Function(code)
  const Component = fn({ ...runtime }).default
  componentCache.set(code, Component)
  return Component
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sharedComponents: Record<string, React.ComponentType<any>> = { Alert, Callout }

interface MDXContentProps {
  code: string
  components?: Record<string, React.ComponentType>
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code)
  return <Component components={{ ...sharedComponents, ...components }} />
}
