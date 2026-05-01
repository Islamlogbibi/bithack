import { useState } from 'react'
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export type SlaBadgeStatus = 'ok' | 'pending' | 'late'

interface SlaBadgeProps {
  /** The SLA window label, e.g. "48h" or "72h" */
  slaLabel: string
  /** Current status */
  status: SlaBadgeStatus
  /** Readable status text */
  statusText: string
  /** Remaining hours (only shown when pending) */
  remainingHours?: number
  /** Tooltip text explaining the SLA */
  tooltip?: string
}

const statusConfig: Record<SlaBadgeStatus, {
  bg: string
  text: string
  border: string
  icon: typeof CheckCircle
  dot: string
}> = {
  ok: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    icon: CheckCircle,
    dot: 'bg-emerald-500',
  },
  pending: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    icon: Clock,
    dot: 'bg-amber-500',
  },
  late: {
    bg: 'bg-red-500/10',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/30',
    icon: AlertTriangle,
    dot: 'bg-red-500',
  },
}

export default function SlaBadge({
  slaLabel,
  status,
  statusText,
  remainingHours,
  tooltip,
}: SlaBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const cfg = statusConfig[status]
  const Icon = cfg.icon

  return (
    <div
      className="relative inline-flex items-center gap-2"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* SLA window badge */}
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border} transition-all`}
      >
        <Clock size={12} className="flex-shrink-0" />
        SLA: {slaLabel}
      </span>

      {/* Status indicator */}
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'late' ? 'animate-pulse' : ''}`} />
        <Icon size={12} className="flex-shrink-0" />
        {statusText}
        {status === 'pending' && remainingHours !== undefined && (
          <span className="opacity-70 ml-0.5">
            ({Math.round(remainingHours)}h left)
          </span>
        )}
      </span>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-xs text-popover-foreground whitespace-nowrap z-50 pointer-events-none">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-popover border-r border-b border-border rotate-45" />
        </div>
      )}
    </div>
  )
}
