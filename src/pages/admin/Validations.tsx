import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ShieldCheck } from 'lucide-react'
import { ADMIN_PENDING_VALIDATIONS } from '../../data/users'

type Tab = 'pending' | 'history'

const HISTORY = [
  { id: 10, teacher: 'Dr. Laadj', module: 'Probabilités', group: 'G1', count: 26, validated: '2025-01-05T10:00:00', validator: 'Prof. Hadj' },
  { id: 11, teacher: 'Dr. Boualem', module: 'Réseaux', group: 'G1', count: 28, validated: '2025-01-04T14:30:00', validator: 'Prof. Hadj' },
  { id: 12, teacher: 'Mme. Ferhat', module: 'Anglais', group: 'G2', count: 25, validated: '2025-01-03T09:00:00', validator: 'Prof. Hadj' },
]

const STEPS = ['Saisi', 'Soumis', 'Validé', 'Publié']

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
  const [pending, setPending] = useState(
    [...ADMIN_PENDING_VALIDATIONS].sort((a, b) => a.slaHours - b.slaHours)
  )
  const [validated, setValidated] = useState<typeof ADMIN_PENDING_VALIDATIONS[0][]>([])

  const handleValidate = (id: number) => {
    const item = pending.find((v) => v.id === id)
    if (item) {
      setPending((p) => p.filter((v) => v.id !== id))
      setValidated((v) => [...v, item])
    }
  }

  const handleReject = (id: number) => {
    setPending((p) => p.filter((v) => v.id !== id))
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
                      <p className="font-semibold text-foreground">{v.teacher}</p>
                      <p className="text-sm text-muted-foreground">{v.module} · {v.group} · {v.count} étudiant(s)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Soumis le {new Date(v.submitted).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusTimeline currentStep={1} />
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
    </>
  )
}
