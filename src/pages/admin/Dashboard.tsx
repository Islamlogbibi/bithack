import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, ShieldCheck, BarChart2, FileText, CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/shared/StatCard'
import { useAuth } from '../../context/AuthContext'
import type { AdminUser, AdminPendingValidation, AbsenceAlertRow, WorkloadRow } from '../../types/domain'
import { apiGet, apiPost } from '../../lib/api'
import { mapApiValidation, mapApiAlert, mapWorkload } from '../../lib/mappers'
import { mockAdmin, mockAdminAbsenceAlerts, mockAdminWorkload } from '../../data/mockAdmin'

const ACTIVITY_FEED = [
  { icon: <CheckCircle size={14} className="text-emerald-500" />, text: 'Dr. Boualem a soumis les notes de Réseaux G3', time: 'il y a 15 min' },
  { icon: <AlertTriangle size={14} className="text-amber-500" />, text: 'Khalil Bouzid approche du seuil d\'exclusion (5 abs.)', time: 'il y a 42 min' },
  { icon: <Activity size={14} className="text-blue-500" />, text: 'Nouvelle ressource publiée par Dr. Meziani', time: 'il y a 1h' },
  { icon: <CheckCircle size={14} className="text-emerald-500" />, text: 'Notes de Mathématiques G2 validées', time: 'il y a 3h' },
  { icon: <Users size={14} className="text-indigo-500" />, text: '12 nouveaux étudiants inscrits ce mois', time: 'il y a 1j' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const admin = user as AdminUser
  const stats = (admin as AdminUser & {
    adminStats?: Partial<AdminUser['stats']>
    stats?: Partial<AdminUser['stats']>
  })?.stats ?? (admin as any)?.adminStats ?? {}
  const safeStats = {
    totalStudents: Number(stats.totalStudents ?? mockAdmin.stats.totalStudents),
    activeTeachers: Number(stats.activeTeachers ?? mockAdmin.stats.activeTeachers),
    pendingValidations: Number(stats.pendingValidations ?? mockAdmin.stats.pendingValidations),
    avgAttendance: Number(stats.avgAttendance ?? mockAdmin.stats.avgAttendance),
    publishedResources: Number(stats.publishedResources ?? mockAdmin.stats.publishedResources),
  }
  const [validations, setValidations] = useState<AdminPendingValidation[]>([])
  const [absenceAlerts, setAbsenceAlerts] = useState<AbsenceAlertRow[]>(mockAdminAbsenceAlerts)
  const [workloadData, setWorkloadData] = useState<WorkloadRow[]>(mockAdminWorkload)
  const [selectedValidation, setSelectedValidation] = useState<AdminPendingValidation | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [rawVal, rawAlerts, workload] = await Promise.all([
          apiGet<Record<string, unknown>[]>('/validations'),
          apiGet<Parameters<typeof mapApiAlert>[0][]>('/attendance/alerts'),
          apiGet<unknown>('/reference/workload'),
        ])
        if (cancelled) return
        const pending = rawVal
          .filter((v) => v.status === 'pending')
          .map((v) => mapApiValidation(v as Parameters<typeof mapApiValidation>[0]))
          .sort((a, b) => a.slaHours - b.slaHours)
          .slice(0, 3)
        setValidations(pending)
        setAbsenceAlerts(rawAlerts.slice(0, 4).map(mapApiAlert))
        setWorkloadData(mapWorkload(workload))
      } catch {
        /* keep empty */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleValidate = async (id: number) => {
    try {
      await apiPost(`/validations/${id}/review`, { status: 'approved' })
      setValidations((prev) => prev.filter((v) => v.id !== id))
    } catch {
      /* ignore */
    }
  }

  const handleReject = async (id: number) => {
    try {
      await apiPost(`/validations/${id}/review`, { status: 'rejected' })
      setValidations((prev) => prev.filter((v) => v.id !== id))
    } catch {
      /* ignore */
    }
  }

  const recentGrades = validations.flatMap((validation) =>
    validation.studentGrades.map((studentGrade) => ({
      ...studentGrade,
      module: validation.module,
      group: validation.group,
    }))
  ).slice(0, 8)

  return (
    <>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl"
      >
        <h2 className="text-xl font-bold text-foreground">Bonjour, {admin.name} 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long' })} · {admin.department}
        </p>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard title="Étudiants" value={safeStats.totalStudents} icon={<Users size={20} />} color="text-blue-500" bgColor="bg-blue-500" delay={0} />
        <StatCard title="Enseignants" value={safeStats.activeTeachers} icon={<BookOpen size={20} />} color="text-indigo-500" bgColor="bg-indigo-500" delay={0.1} />
        <StatCard title="Validations" value={safeStats.pendingValidations} icon={<ShieldCheck size={20} />} color="text-red-500" bgColor="bg-red-500" delay={0.2} badge="Urgent" badgeColor="bg-red-500/20 text-red-500" />
        <StatCard title="Présence moy." value={safeStats.avgAttendance} suffix="%" icon={<BarChart2 size={20} />} color="text-emerald-500" bgColor="bg-emerald-500" delay={0.3} />
        <StatCard title="Ressources" value={safeStats.publishedResources} icon={<FileText size={20} />} color="text-amber-500" bgColor="bg-amber-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pending validations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Notes à valider
            </h3>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setValidations([])}
              className="text-xs font-semibold px-3 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-colors"
            >
              Tout valider
            </motion.button>
          </div>
          <div className="space-y-3">
            {validations.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Toutes les soumissions ont été traitées.</div>
            ) : validations.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-secondary rounded-xl"
              >
                <div>
                  <button onClick={() => setSelectedValidation(v)} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {v.teacher}
                  </button>
                  <p className="text-xs text-muted-foreground">{v.speciality} · {v.module} · {v.level} · Section {v.section} · {v.group} · {v.count} étudiant(s)</p>
                  <p className={`text-xs font-semibold mt-0.5 ${v.slaHours <= 2 ? 'text-red-500' : v.slaHours <= 8 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                    {v.slaHours <= 0 ? 'SLA dépassé !' : `SLA: ${v.slaHours}h restant(es)`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => void handleValidate(v.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
                  >
                    <CheckCircle size={13} />
                    Valider
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => void handleReject(v.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500/15 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-500/25 transition-colors"
                  >
                    <XCircle size={13} />
                    Rejeter
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            Activité récente
          </h3>
          <div className="space-y-3">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Absence alerts + Workload chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absence alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Alertes absences
          </h3>
          <div className="space-y-2">
            {absenceAlerts.map((a, i) => (
              <div key={a.id ?? i} className={`flex items-center justify-between p-3 rounded-xl border ${a.risk === 'high' ? 'border-red-500/30 bg-red-500/5' : a.risk === 'medium' ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-secondary'}`}>
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.student}</p>
                  <p className="text-xs text-muted-foreground">{a.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${a.risk === 'high' ? 'text-red-500' : a.risk === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {a.absences}/{a.max}
                  </span>
                  <p className="text-xs text-muted-foreground">abs.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Workload chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Charge horaire — Enseignants</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={workloadData.length ? workloadData : [{ teacher: '—', planned: 0, completed: 0 }]} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <YAxis dataKey="teacher" type="category" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={95} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="planned" name="Prévues" fill="var(--border)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="completed" name="Réalisées" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-card border border-border rounded-xl p-5 mt-6"
      >
        <h3 className="font-semibold text-foreground mb-4">Notes des étudiants (aperçu)</h3>
        <div className="space-y-2">
          {recentGrades.map((grade) => (
            <div key={`${grade.matricule}-${grade.module}`} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
              <div>
                <p className="text-sm font-semibold text-foreground">{grade.student}</p>
                <p className="text-xs text-muted-foreground">{grade.matricule} · {grade.module} · {grade.group}</p>
              </div>
              <span className="text-sm font-bold text-primary">{grade.grade.toFixed(1)}/20</span>
            </div>
          ))}
        </div>
      </motion.div>

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
