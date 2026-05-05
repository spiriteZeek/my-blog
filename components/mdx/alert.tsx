interface AlertProps {
  type?: 'info' | 'tip' | 'warning' | 'danger'
  children: React.ReactNode
}

const styles = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  tip: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  danger: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
}

const labels = { info: 'Info', tip: 'Tip', warning: 'Warning', danger: 'Danger' }

export function Alert({ type = 'info', children }: AlertProps) {
  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <p className="mb-1 text-sm font-semibold">{labels[type]}</p>
      <div className="text-sm">{children}</div>
    </div>
  )
}
