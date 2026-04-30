import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StatusBadge from '../../components/shared/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { StudentUser } from '../../data/users'

function GpaRing({ value, max = 20 }: { value: number; max?: number }) {
  const pct = (value / max) * 100
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" className="text-border" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none"
          stroke="url(#gpaGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gpaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold text-primary">{value}</span>
        <span className="text-sm text-muted-foreground">/20</span>
      </div>
    </div>
  )
}

export default function StudentGrades() {
  const { user } = useAuth()
  const student = user as StudentUser

  const totalCredits = student.grades.reduce((a, g) => a + g.credits, 0)
  const validatedCredits = student.gpa >= 10 ? totalCredits : student.grades.filter((g) => g.status === 'Validé').reduce((a, g) => a + g.credits, 0)

  const chartData = student.grades.map((g) => ({
    name: g.subject.split(' ')[0],
    td: g.td,
    exam: g.exam ?? 0,
    final: g.final ?? 0,
  }))

  const getTrend = (g: StudentUser['grades'][0]) => {
    if (!g.final) return <Minus size={14} className="text-muted-foreground" />
    if (g.final >= 14) return <TrendingUp size={14} className="text-emerald-500" />
    if (g.final >= 10) return <Minus size={14} className="text-amber-500" />
    return <TrendingDown size={14} className="text-red-500" />
  }

  const getRowColor = (final: number | null) => {
    if (!final) return ''
    if (final >= 14) return 'bg-emerald-500/5'
    if (final >= 10) return 'bg-amber-500/5'
    return 'bg-red-500/5'
  }

  return (
    <>
      {/* GPA Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6"
      >
        <GpaRing value={student.gpa} />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-foreground">Moyenne Générale</h2>
          <p className="text-sm text-muted-foreground mt-1">{student.year} — {student.group}</p>
          <div className="mt-3 flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="px-3 py-1.5 bg-secondary rounded-lg text-sm">
              <span className="text-muted-foreground">Crédits validés: </span>
              <span className="font-bold text-foreground">{validatedCredits}/{totalCredits}</span>
            </div>
            <div className="px-3 py-1.5 bg-secondary rounded-lg text-sm">
              <span className="text-muted-foreground">Matières: </span>
              <span className="font-bold text-foreground">{student.grades.length}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 max-w-xs mx-auto md:mx-0">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progression crédits</span>
              <span>{Math.round((validatedCredits / totalCredits) * 100)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(validatedCredits / totalCredits) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <Award className="text-amber-500" size={20} />
          <div>
            <p className="text-xs text-muted-foreground">Mention</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Bien</p>
          </div>
        </div>
      </motion.div>

      {/* Grade Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl overflow-hidden mb-6"
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Détail des notes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Matière</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">TD</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Examen</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Moyenne</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Crédits</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Tendance</th>
              </tr>
            </thead>
            <tbody>
              {student.grades.map((g, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`border-b border-border last:border-0 ${getRowColor(g.final)}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">{g.subject}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{g.td}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{g.exam ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold text-base ${(g.final ?? 0) >= 14 ? 'text-emerald-500' : (g.final ?? 0) >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
                      {g.final ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{g.credits}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-3 text-center flex justify-center">{getTrend(g)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="font-semibold text-foreground mb-4">Comparaison des notes par matière</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
            <YAxis domain={[0, 20]} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Bar dataKey="td" name="TD" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="exam" name="Examen" fill="#6366F1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="final" name="Moyenne" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.final >= 14 ? '#10B981' : entry.final >= 10 ? '#F59E0B' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  )
}
