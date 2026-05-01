import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import type { StudentUser } from '../../types/domain'

const MAX_ABSENCES = 6

const ABSENCE_DETAILS: Record<string, { date: string; type: string }[]> = {
  algo: [
    { date: '05 Jan 2025', type: 'Cours' },
    { date: '12 Jan 2025', type: 'TD' },
    { date: '19 Jan 2025', type: 'TP' },
    { date: '26 Jan 2025', type: 'Cours' },
  ],
  networks: [{ date: '08 Jan 2025', type: 'TP' }],
  db: [
    { date: '06 Jan 2025', type: 'TD' },
    { date: '13 Jan 2025', type: 'Cours' },
  ],
}

const SUBJECT_NAMES: Record<string, string> = {
  algo: 'Algorithmique',
  networks: 'Réseaux',
  db: 'Base de Données',
}

function AbsenceRing({ count, max }: { count: number; max: number }) {
  const pct = (count / max) * 100
  const r = 30
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color = count >= 5 ? '#EF4444' : count >= 3 ? '#F59E0B' : '#10B981'

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
        <motion.circle
          cx="35" cy="35" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-lg font-bold" style={{ color }}>{count}</span>
        <span className="text-xs text-muted-foreground">/{max}</span>
      </div>
    </div>
  )
}

export default function StudentAttendance() {
  const { user } = useAuth()
  const student = user as StudentUser

  const totalSessions = 30
  const totalAbsences = Object.values(student.absences).reduce((a, b) => a + b, 0)
  const attendanceRate = Math.round(((totalSessions - totalAbsences) / totalSessions) * 100)

  const pieData = [
    { name: 'Présent', value: totalSessions - totalAbsences },
    { name: 'Absent', value: totalAbsences },
  ]

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Donut chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-xl p-5 flex flex-col items-center"
        >
          <h3 className="font-semibold text-foreground mb-3 self-start">Taux de présence global</h3>
          <div className="relative">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={pieData} cx={90} cy={90} innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                  <Cell fill="#3B82F6" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{attendanceRate}%</span>
                <p className="text-xs text-muted-foreground">Présence</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Présent ({totalSessions - totalAbsences})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Absent ({totalAbsences})</span>
            </div>
          </div>
        </motion.div>

        {/* Per-subject absence cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(student.absences).map(([key, count], i) => {
            const isAlert = count >= 5
            const isWarning = count >= 3 && count < 5
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`bg-card border rounded-xl p-4 ${isAlert ? 'border-red-500/40' : isWarning ? 'border-amber-500/40' : 'border-border'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{SUBJECT_NAMES[key]}</p>
                  {isAlert ? (
                    <AlertTriangle size={16} className="text-red-500" />
                  ) : isWarning ? (
                    <AlertTriangle size={16} className="text-amber-500" />
                  ) : (
                    <CheckCircle size={16} className="text-emerald-500" />
                  )}
                </div>
                <div className="flex justify-center mb-3">
                  <AbsenceRing count={count} max={MAX_ABSENCES} />
                </div>
                <div className="space-y-1">
                  {(ABSENCE_DETAILS[key] || []).map((d, j) => (
                    <div key={j} className="flex justify-between text-xs text-muted-foreground">
                      <span>{d.date}</span>
                      <span className="font-medium">{d.type}</span>
                    </div>
                  ))}
                </div>
                {isAlert && (
                  <p className="mt-2 text-xs font-bold text-red-500 text-center">Risque d&apos;exclusion !</p>
                )}
                {isWarning && (
                  <p className="mt-2 text-xs font-semibold text-amber-500 text-center">Soyez prudent</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* History table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Historique des absences</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Matière</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ABSENCE_DETAILS).flatMap(([key, details]) =>
                details.map((d, i) => (
                  <tr key={`${key}-${i}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{SUBJECT_NAMES[key]}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{d.type}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 bg-red-500/15 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">Absent</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  )
}
