interface CalloutProps {
  children: React.ReactNode
}

export function Callout({ children }: CalloutProps) {
  return (
    <div className="my-6 rounded-lg border border-pink-200 bg-pink-50 p-4 dark:border-pink-800 dark:bg-pink-950">
      <div className="text-sm text-pink-800 dark:text-pink-200">{children}</div>
    </div>
  )
}
