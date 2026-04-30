import { motion } from 'framer-motion'
import { Clock, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { TeacherUser, WORKLOAD_DATA } from '../../data/users'

const MONTHLY_DATA = [
  { month: 'Sep', hours: 12 },
  { month: 'Oct', hours: 18 },
  { month: 'Nov', hours: 16 },
  { month: 'Déc', hours: 14 },
  { month: 'Jan', hours: 12 },
]

export default function TeacherWorkload() {
  const { user } = useAuth()
  const teacher = user as TeacherUser
  const pct = Math.round((teacher.hoursCompleted / teacher.hoursPlanned) * 100)

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Heures prévues', value: teacher.hoursPlanned, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Heures réalisées', value: teacher.hoursCompleted, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Heures restantes', value: teacher.hoursPlanned - teacher.hoursCompleted, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
              <Clock className={item.color} size={20} />
            </div>
            <p className={`text-3xl font-bold ${item.color}`}>{item.value}h</p>
            <p className="text-sm text-muted-foreground mt-0.5">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5 mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-foreground">Progression globale</h3>
          <span className="text-sm font-bold text-primary">{pct}%</span>
        </div>
        <div className="h-4 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, delay: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>0h</span>
          <span>{teacher.hoursPlanned}h</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            Heures par mois
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="hours" name="Heures" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department workload comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Comparatif département</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WORKLOAD_DATA} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={[0, 100]} />
              <YAxis dataKey="teacher" type="category" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={100} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="planned" name="Prévues" fill="#E2E8F0" radius={[0, 4, 4, 0]} />
              <Bar dataKey="completed" name="Réalisées" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </>
  )
}
