import type { SessionStatus } from '@/models/enums'

const config: Record<SessionStatus, { label: string; className: string }> = {
  success: {
    label: 'Gelukt',
    className: 'bg-green-100 text-green-700',
  },
  partial: {
    label: 'Deels',
    className: 'bg-orange-100 text-orange-700',
  },
  failed: {
    label: 'Mislukt',
    className: 'bg-red-100 text-red-700',
  },
}

export function StatusBadge({ status }: { status: SessionStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
