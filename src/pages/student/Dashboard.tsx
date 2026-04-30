import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar, FileText, QrCode, BookOpen, Bot, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../../components/shared/StatCard'
import StatusBadge from '../../components/shared/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { StudentUser } from '../../data/users'

const TYPE_COLORS: Record<string, string> = {
  Cours: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  TD: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  TP: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const student = user as StudentUser

  const totalAbsences = Object.values(student.absences).reduce((a, b) => a + b, 0)
  const today = new Date()
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const todayName = days[today.getDay()]
  const greeting = student.gpa >= 14 ? 'Excellent semestre, continuez ainsi !' : student.gpa >= 10 ? 'Bon semestre, ne relâchez pas vos efforts !' : 'Du travail est nécessaire, accrochez-vous !'

  const weekSchedule = student.schedule.slice(0, 6)

  return (
    <>
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Bonjour, {student.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {today.toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long' })} — {greeting}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs text-muted-foreground">Matricule</p>
          <p className="text-sm font-bold text-foreground">{student.matricule}</p>
          <p className="text-xs text-muted-foreground">{student.year} · {student.group}</p>
        </div>
      </motion.div>

      {/* Alert banner */}
      {student.absences.algo >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl flex items-start gap-3"
          style={{ animation: 'pulse 2s infinite' }}
        >
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              Attention: Vous avez {student.absences.algo} absences en Algorithmique.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Seuil d&apos;exclusion: 6. Il vous reste {6 - student.absences.algo} absence(s) avant exclusion.
            </p>
          </div>
        </motion.div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Moyenne générale" value={student.gpa} suffix="/20" icon={<TrendingUp size={20} />} color="text-blue-500" bgColor="bg-blue-500" delay={0} />
        <StatCard title="Total absences" value={totalAbsences} icon={<Users size={20} />} color={totalAbsences >= 5 ? 'text-red-500' : totalAbsences >= 3 ? 'text-amber-500' : 'text-emerald-500'} bgColor={totalAbsences >= 5 ? 'bg-red-500' : 'bg-amber-500'} delay={0.1} />
        <StatCard title="Cours / semaine" value={student.schedule.length} icon={<Calendar size={20} />} color="text-indigo-500" bgColor="bg-indigo-500" delay={0.2} />
        <StatCard title="Ressources" value={24} icon={<FileText size={20} />} color="text-orange-500" bgColor="bg-orange-500" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly schedule preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Emploi du temps cette semaine
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2 min-w-max">
              {weekSchedule.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`flex-shrink-0 w-44 p-3 rounded-lg border ${TYPE_COLORS[s.type]} `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">{s.type}</span>
                    <span className="text-xs">{s.time}</span>
                  </div>
                  <p className="text-sm font-bold">{s.subject}</p>
                  <p className="text-xs mt-0.5 opacity-70">{s.day} · {s.room}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent grades */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Notes récentes
          </h3>
          <div className="space-y-2">
            {student.grades.slice(0, 4).map((g, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[130px]">{g.subject}</p>
                  <StatusBadge status={g.status} />
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${(g.final ?? 0) >= 14 ? 'text-emerald-500' : (g.final ?? 0) >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
                    {g.final ?? '—'}
                  </span>
                  <p className="text-xs text-muted-foreground">/20</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Scanner QR', icon: <QrCode size={20} />, color: 'from-blue-500 to-blue-600', onClick: () => navigate('/student/attendance') },
          { label: 'Voir notes', icon: <BookOpen size={20} />, color: 'from-indigo-500 to-indigo-600', onClick: () => navigate('/student/grades') },
          { label: 'Assistant IA', icon: <Bot size={20} />, color: 'from-purple-500 to-indigo-500', onClick: () => navigate('/student/ai-assistant') },
        ].map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-2 py-4 rounded-xl bg-gradient-to-br ${action.color} text-white font-semibold text-sm shadow-lg`}
          >
            {action.icon}
            {action.label}
          </motion.button>
        ))}
      </motion.div>
    </>
  )
}
