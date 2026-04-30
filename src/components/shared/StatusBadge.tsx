interface StatusBadgeProps {
  status: string
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  'Validé': { bg: 'bg-emerald-500/15 dark:bg-emerald-400/15', text: 'text-emerald-600 dark:text-emerald-400' },
  'En attente': { bg: 'bg-amber-500/15 dark:bg-amber-400/15', text: 'text-amber-600 dark:text-amber-400' },
  'Rejeté': { bg: 'bg-red-500/15 dark:bg-red-400/15', text: 'text-red-600 dark:text-red-400' },
  'Publié': { bg: 'bg-blue-500/15 dark:bg-blue-400/15', text: 'text-blue-600 dark:text-blue-400' },
  'Soumis': { bg: 'bg-purple-500/15 dark:bg-purple-400/15', text: 'text-purple-600 dark:text-purple-400' },
  'Saisi': { bg: 'bg-slate-500/15 dark:bg-slate-400/15', text: 'text-slate-600 dark:text-slate-400' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status] || { bg: 'bg-muted', text: 'text-muted-foreground' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {status}
    </span>
  )
}
