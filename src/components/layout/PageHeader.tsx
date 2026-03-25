import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-6">
      <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A] leading-tight">{title}</h1>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
