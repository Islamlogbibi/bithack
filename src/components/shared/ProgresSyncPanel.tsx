import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle, AlertTriangle, Loader2, Database } from 'lucide-react'
import type { ProgresSyncStatus } from '../../lib/sla'
import { createProgresSync } from '../../lib/sla'

export default function ProgresSyncPanel() {
  const [status, setStatus] = useState<ProgresSyncStatus>('idle')
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  const handleSync = async () => {
    const sync = createProgresSync(setStatus)
    await sync()
    // If success, record the time
    setLastSynced(new Date())
  }

  const statusMap: Record<ProgresSyncStatus, {
    icon: JSX.Element
    label: string
    color: string
    bg: string
    border: string
    dot: string
  }> = {
    idle: {
      icon: <Database size={16} />,
      label: 'Non synchronisé',
      color: 'text-muted-foreground',
      bg: 'bg-secondary',
      border: 'border-border',
      dot: 'bg-muted-foreground',
    },
    loading: {
      icon: <Loader2 size={16} className="animate-spin" />,
      label: 'Synchronisation...',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500 animate-pulse',
    },
    success: {
      icon: <CheckCircle size={16} />,
      label: 'Synchronisé',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    error: {
      icon: <AlertTriangle size={16} />,
      label: 'Échec de synchronisation',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      dot: 'bg-red-500 animate-pulse',
    },
  }

  const current = statusMap[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 rounded-xl border ${current.border} ${current.bg} p-4`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: PROGRES label + status */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.bg} ${current.color}`}>
            <RefreshCw size={20} className={status === 'loading' ? 'animate-spin' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">🔄 Synced with PROGRES</h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">
                read-only
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${current.dot}`} />
              <span className={`text-xs font-semibold ${current.color}`}>
                {current.icon}
              </span>
              <span className={`text-xs font-semibold ${current.color}`}>
                {current.label}
              </span>
            </div>
            {lastSynced && status === 'success' && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Dernière sync : {lastSynced.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        {/* Right: Sync button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleSync}
          disabled={status === 'loading'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
            ${status === 'loading'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Synchronisation...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Sync with PROGRES
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
