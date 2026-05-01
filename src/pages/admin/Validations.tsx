import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react'
import { AdminPendingValidation } from '../../types/domain'
import { apiGet, apiPost } from '../../lib/api'
import { mapApiValidation } from '../../lib/mappers'
import { useEffect } from 'react'
import { hoursDiff } from '../../lib/sla'
import SlaBadge from '../../components/shared/SlaBadge'
import type { SlaBadgeStatus } from '../../components/shared/SlaBadge'

type Tab = 'pending' | 'history'

const HISTORY = [
  { id: 10, teacher: 'Dr. Laadj', module: 'Probabilités', group: 'G1', count: 26, validated: '2025-01-05T10:00:00', validator: 'Prof. Hadj' },
  { id: 11, teacher: 'Dr. Boualem', module: 'Réseaux', group: 'G1', count: 28, validated: '2025-01-04T14:30:00', validator: 'Prof. Hadj' },
  { id: 12, teacher: 'Mme. Ferhat', module: 'Anglais', group: 'G2', count: 25, validated: '2025-01-03T09:00:00', validator: 'Prof. Hadj' },
]

const STEPS = ['Saisi', 'Soumis', 'Validé', 'Publié']

/** Compute SLA 72h status for a grade validation. */
function getValidationSla(v: AdminPendingValidation): { badgeStatus: SlaBadgeStatus; label: string; remaining: number } {
  // If already validated (approved/rejected), it's OK
  if (v.status === 'approved' || v.status === 'rejected') {
    return { badgeStatus: 'ok', label: 'Validé', remaining: 0 }
  }
  const elapsed = hoursDiff(new Date(v.submitted), new Date())
  if (elapsed > 72) return { badgeStatus: 'late', label: 'En retard', remaining: 0 }
  return { badgeStatus: 'pending', label: 'En attente', remaining: Math.max(0, 72 - elapsed) }
}

function StatusTimeline({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${i <= currentStep ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {i <= currentStep && <CheckCircle size={10} />}
            {step}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-4 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function AdminValidations() {
  const [tab, setTab] = useState<Tab>('pending')
  const [pending, setPending] = useState<AdminPendingValidation[]>([])
  const [validated, setValidated] = useState<AdminPendingValidation[]>([])
  const [selectedValidation, setSelectedValidation] = useState<AdminPendingValidation | null>(null)

  useEffect(() => {
    apiGet<Record<string, unknown>[]>('/validations')
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(v => mapApiValidation(v as any))
          setPending(mapped.filter(v => v.status === 'pending').sort((a, b) => a.slaHours - b.slaHours))
          setValidated(mapped.filter(v => v.status === 'approved' || v.status === 'rejected'))
        }
      })
      .catch(console.error)
  }, [])

  const handleValidate = async (id: number) => {
    try {
      await apiPost(`/validations/${id}/review`, { status: 'approved' })
      const item = pending.find((v) => v.id === id)
      if (item) {
        setPending((p) => p.filter((v) => v.id !== id))
        setValidated((v) => [...v, item])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await apiPost(`/validations/${id}/review`, { status: 'rejected' })
      setPending((p) => p.filter((v) => v.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'pending' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
        >
          En attente
          {pending.length > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{pending.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'history' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Historique
        </button>
      </div>

      {/* SLA 72h overview banner (only on pending tab) */}
      {tab === 'pending' && pending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span className="text-sm font-bold text-foreground">SLA Validation Notes</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">72h max</span>
          {(() => {
            const late = pending.filter(v => getValidationSla(v).badgeStatus === 'late').length
            const waiting = pending.filter(v => getValidationSla(v).badgeStatus === 'pending').length
            return (
              <div className="flex items-center gap-3 ml-auto text-xs font-semibold">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" />{waiting} en attente</span>
                {late > 0 && <span className="flex items-center gap-1 text-red-600 dark:text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{late} en retard</span>}
              </div>
            )
          })()}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {tab === 'pending' ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {pending.length === 0 ? (
              <div className="py-20 text-center">
                <ShieldCheck size={40} className="text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-foreground">Toutes les soumissions ont été traitées</p>
                <p className="text-sm text-muted-foreground mt-1">Aucune validation en attente.</p>
              </div>
            ) : pending.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {v.teacher.charAt(v.teacher.indexOf(' ') + 1)}
                    </div>
                    <div>
                      <button onClick={() => setSelectedValidation(v)} className="font-semibold text-foreground hover:text-primary transition-colors">
                        {v.teacher}
                      </button>
                      <p className="text-sm text-muted-foreground">{v.speciality} · {v.module} · {v.level} · Section {v.section} · {v.group} · {v.count} étudiant(s)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Soumis le {new Date(v.submitted).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusTimeline currentStep={1} />
                    {/* SLA 72h badge */}
                    {(() => {
                      const sla = getValidationSla(v)
                      return (
                        <SlaBadge
                          slaLabel="72h"
                          status={sla.badgeStatus}
                          statusText={sla.label}
                          remainingHours={sla.remaining}
                          tooltip="Les notes doivent être validées dans les 72 heures suivant leur soumission"
                        />
                      )
                    })()}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.slaHours <= 2 ? 'bg-red-500/15 text-red-500' : 'bg-amber-500/15 text-amber-500'}`}>
                      {v.slaHours <= 2 ? 'Urgent' : 'Standard'}
                    </span>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${v.slaHours <= 2 ? 'text-red-500' : v.slaHours <= 8 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                      <Clock size={12} />
                      {v.slaHours <= 0 ? 'SLA dépassé !' : `Doit être publié dans ${v.slaHours}h`}
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-secondary">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Notes étudiants</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {v.studentGrades.map((student) => (
                      <div key={student.matricule} className="p-2 rounded-lg border border-border bg-card">
                        <p className="text-xs font-semibold text-foreground">{student.student}</p>
                        <p className="text-[11px] text-muted-foreground">{student.matricule}</p>
                        <p className="text-xs font-bold text-primary mt-1">{student.grade.toFixed(1)}/20</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleValidate(v.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-semibold hover:bg-emerald-500/25 transition-colors"
                  >
                    <CheckCircle size={15} />
                    Valider
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleReject(v.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/15 text-red-500 border border-red-500/30 rounded-xl text-sm font-semibold hover:bg-red-500/25 transition-colors"
                  >
                    <XCircle size={15} />
                    Rejeter
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {[...validated.map((v) => ({ ...v, isNew: true })), ...HISTORY.map((h) => ({ ...h, isNew: false, slaHours: 0, submitted: h.validated }))].map((v, i) => (
              <motion.div
                key={`h-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-emerald-500/15 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-emerald-500" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{v.teacher}</p>
                    <p className="text-xs text-muted-foreground">{v.module} · {v.group} · {v.count} étudiant(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusTimeline currentStep={3} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Validé par Prof. Hadj
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedValidation && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{selectedValidation.teacher} — notes saisies</h3>
              <button onClick={() => setSelectedValidation(null)} className="text-sm text-muted-foreground hover:text-foreground">Fermer</button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              {selectedValidation.speciality} · {selectedValidation.module} · {selectedValidation.level} · Section {selectedValidation.section} · {selectedValidation.group}
            </p>
            <div className="space-y-2">
              {selectedValidation.studentGrades.map((student) => (
                <div key={student.matricule} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{student.student}</p>
                    <p className="text-xs text-muted-foreground">{student.matricule}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">{student.grade.toFixed(1)}/20</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
