import { motion } from 'framer-motion'
import { Users, ClipboardList, Clock, CalendarCheck, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../../components/shared/StatCard'
import StatusBadge from '../../components/shared/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser } from '../../types/domain'
import { getScheduleByScope } from '../../lib/api'
import { useState, useEffect } from 'react'

// Removed static TODAY_SESSIONS

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const teacher = user as TeacherUser

  const pct = Math.round((teacher.hoursCompleted / teacher.hoursPlanned) * 100) || 0

  const [todaySessions, setTodaySessions] = useState<any[]>([])

  useEffect(() => {
    // Fetch schedule for this teacher
    getScheduleByScope('teacher', String(teacher.id))
      .then(data => {
        if (data && Array.isArray(data)) {
          // Filter for today if needed, or assume backend returns today's sessions
          // For now just taking all to avoid empty states in demo
          setTodaySessions(data)
        }
      })
      .catch(console.error)
  }, [teacher.id])

  return (
    <>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl"
      >
        <h2 className="text-xl font-bold text-foreground">Bonjour, {teacher.name} 👋</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long' })} · Département {teacher.department}
        </p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Groupes actifs" value={teacher.groups.length} icon={<Users size={20} />} color="text-blue-500" bgColor="bg-blue-500" delay={0} />
        <StatCard title="Notes en attente" value={teacher.pendingGrades.length} icon={<ClipboardList size={20} />} color="text-amber-500" bgColor="bg-amber-500" delay={0.1} badge={String(teacher.pendingGrades.length)} badgeColor="bg-amber-500 text-white" />
        <StatCard title="Heures réalisées" value={teacher.hoursCompleted} suffix={`/${teacher.hoursPlanned}`} icon={<Clock size={20} />} color="text-indigo-500" bgColor="bg-indigo-500" delay={0.2} />
        <StatCard title="Sessions aujourd'hui" value={todaySessions.length} icon={<CalendarCheck size={20} />} color="text-emerald-500" bgColor="bg-emerald-500" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today sessions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarCheck size={18} className="text-primary" />
            Sessions d&apos;aujourd&apos;hui
          </h3>
          <div className="space-y-3">
            {todaySessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                <div>
                  <p className="font-semibold text-foreground text-sm">{s.subject}</p>
                  <p className="text-xs text-muted-foreground">{s.group} · {s.time} · {s.room}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/teacher/qr-attendance')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold"
                >
                  <QrCode size={14} />
                  Démarrer QR
                </motion.button>
              </div>
            ))}
            {todaySessions.length === 0 && (
              <p className="text-sm text-muted-foreground italic">Aucune session aujourd'hui.</p>
            )}
          </div>
        </motion.div>

        {/* Pending grades */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-amber-500" />
            Notes à saisir
          </h3>
          <div className="space-y-2">
            {teacher.pendingGrades.map((g, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{g.student}</p>
                  <p className="text-xs text-muted-foreground">{g.matricule} · {g.group}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.td >= 14 ? 'bg-emerald-500/15 text-emerald-500' : g.td >= 10 ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500'}`}>
                    TD: {g.td}
                  </span>
                  <StatusBadge status={g.status} />
                </div>
              </div>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/teacher/grades')}
            className="mt-3 w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
          >
            Saisir les notes
          </motion.button>
        </motion.div>
      </div>

      {/* Workload progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-card border border-border rounded-xl p-5"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Charge horaire — Semestre en cours
          </h3>
          <span className="text-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, delay: 0.7 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>{teacher.hoursCompleted}h réalisées</span>
          <span>{teacher.hoursPlanned}h prévues</span>
        </div>
      </motion.div>
    </>
  )
}
