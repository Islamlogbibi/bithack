import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Mail, Bell, CheckCircle } from 'lucide-react'
import { apiGet, apiPatch } from '../../lib/api'
import { mapApiAlert } from '../../lib/mappers'
import { AbsenceAlertRow } from '../../types/domain'

const RISK_STYLE: Record<string, string> = {
  high: 'border-red-500/40 bg-red-500/5',
  medium: 'border-amber-500/40 bg-amber-500/5',
  low: 'border-border bg-secondary/30',
}

const RISK_TEXT: Record<string, string> = {
  high: 'text-red-500',
  medium: 'text-amber-500',
  low: 'text-emerald-500',
}

const RISK_LABEL: Record<string, string> = {
  high: 'Critique',
  medium: 'Avertissement',
  low: 'Faible',
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<AbsenceAlertRow[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [notified, setNotified] = useState<string[]>([])

  useEffect(() => {
    apiGet<any[]>('/attendance/alerts')
      .then(data => {
        if (Array.isArray(data)) {
          setAlerts(data.map(mapApiAlert))
        }
      })
      .catch(console.error)
  }, [])

  const filtered = alerts.filter((a) => filter === 'all' || a.risk === filter)

  const handleDismiss = async (alert: AbsenceAlertRow) => {
    try {
      if (alert.id) {
        await apiPatch(`/attendance/alerts/${alert.id}/dismiss`)
      }
      setDismissed((prev) => [...prev, alert.matricule])
      setAlerts((prev) => prev.filter((a) => a.matricule !== alert.matricule))
    } catch (err) {
      console.error(err)
    }
  }

  const handleNotify = (matricule: string) => {
    setNotified((prev) => [...prev, matricule])
  }

  const notifyAll = () => {
    setNotified(alerts.map((a) => a.matricule))
  }

  const removeNotifiedFromList = () => {
    setAlerts((prev) => prev.filter((a) => !notified.includes(a.matricule)))
    setDismissed((prev) => [...prev, ...notified.filter((n) => !prev.includes(n))])
    setNotified([])
  }

  return (
    <>
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          {(['all', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {f === 'all' ? `Tous (${alerts.length})` : f === 'high' ? `Critique (${alerts.filter((a) => a.risk === 'high').length})` : f === 'medium' ? `Avertissement (${alerts.filter((a) => a.risk === 'medium').length})` : `Faible (${alerts.filter((a) => a.risk === 'low').length})`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={notifyAll}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
          >
            <Mail size={16} />
            Notifier tous les étudiants
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={removeNotifiedFromList}
            className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-xl text-sm font-semibold text-foreground"
          >
            Retirer notifiés
          </motion.button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Alertes critiques', count: alerts.filter((a) => a.risk === 'high').length, color: 'text-red-500 bg-red-500/10', icon: <AlertTriangle size={20} /> },
          { label: 'Avertissements', count: alerts.filter((a) => a.risk === 'medium').length, color: 'text-amber-500 bg-amber-500/10', icon: <Bell size={20} /> },
          { label: 'Notifications envoyées', count: notified.length, color: 'text-emerald-500 bg-emerald-500/10', icon: <CheckCircle size={20} /> },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center text-center"
            >
              <CheckCircle size={40} className="text-emerald-500 mb-3" />
              <p className="font-semibold text-foreground">Aucune alerte dans cette catégorie</p>
              <p className="text-sm text-muted-foreground mt-1">Tous les étudiants ont un taux de présence acceptable.</p>
            </motion.div>
          ) : filtered.map((a, i) => {
            const isNotified = notified.includes(a.matricule)
            return (
              <motion.div
                key={a.matricule}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-card border rounded-xl p-5 ${RISK_STYLE[a.risk]}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${a.risk === 'high' ? 'bg-red-500/15' : a.risk === 'medium' ? 'bg-amber-500/15' : 'bg-emerald-500/15'}`}>
                      <AlertTriangle size={22} className={RISK_TEXT[a.risk]} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{a.student}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.risk === 'high' ? 'bg-red-500/15 text-red-500' : a.risk === 'medium' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
                          {RISK_LABEL[a.risk]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{a.matricule} · {a.subject}</p>
                      {/* Absence bar */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${a.risk === 'high' ? 'bg-red-500' : a.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${(a.absences / a.max) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${RISK_TEXT[a.risk]}`}>{a.absences}/{a.max}</span>
                        <span className="text-xs text-muted-foreground">absences</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {a.absences >= a.max - 1
                          ? 'Exclusion imminente — intervention urgente requise'
                          : `${a.max - a.absences} absence(s) avant exclusion de l'examen`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNotify(a.matricule)}
                      disabled={isNotified}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isNotified
                          ? 'bg-emerald-500/15 text-emerald-500 cursor-default'
                          : 'bg-primary/15 text-primary hover:bg-primary/25'
                      }`}
                    >
                      {isNotified ? <CheckCircle size={13} /> : <Mail size={13} />}
                      {isNotified ? 'Notifié' : 'Notifier'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDismiss(a)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}
