import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']
const TIMES = ['08:00', '10:00', '12:00', '14:00', '16:00']

const ALL_SESSIONS = [
  { day: 'Dimanche', time: '08:00', subject: 'Algorithmique', room: 'A12', teacher: 'Dr. Meziani', group: 'G2', type: 'Cours' },
  { day: 'Dimanche', time: '10:00', subject: 'Réseaux', room: 'Labo R3', teacher: 'Dr. Boualem', group: 'G1', type: 'TP' },
  { day: 'Dimanche', time: '14:00', subject: 'Probabilités', room: 'A08', teacher: 'Dr. Laadj', group: 'G3', type: 'Cours' },
  { day: 'Lundi', time: '08:00', subject: 'Base de Données', room: 'B04', teacher: 'Mme. Rahmani', group: 'G1', type: 'TD' },
  { day: 'Lundi', time: '10:00', subject: 'Structures de Données', room: 'Labo Info', teacher: 'Dr. Meziani', group: 'G1', type: 'TP' },
  { day: 'Lundi', time: '14:00', subject: 'Mathématiques', room: 'A08', teacher: 'Dr. Laadj', group: 'G2', type: 'Cours' },
  { day: 'Mardi', time: '08:00', subject: 'Anglais Technique', room: 'C02', teacher: 'Mme. Ferhat', group: 'G1', type: 'TD' },
  { day: 'Mardi', time: '10:00', subject: 'Algorithmique', room: 'Labo Info', teacher: 'Dr. Meziani', group: 'G2', type: 'TP' },
  { day: 'Mercredi', time: '08:00', subject: 'Réseaux', room: 'B06', teacher: 'Dr. Boualem', group: 'G2', type: 'TD' },
  { day: 'Mercredi', time: '10:00', subject: 'Base de Données', room: 'A12', teacher: 'Mme. Rahmani', group: 'G3', type: 'Cours' },
  { day: 'Jeudi', time: '08:00', subject: 'Probabilités', room: 'A10', teacher: 'Dr. Laadj', group: 'G1', type: 'TD' },
  { day: 'Jeudi', time: '14:00', subject: 'Algorithmique', room: 'A12', teacher: 'Dr. Meziani', group: 'G3', type: 'Cours' },
]

const TYPE_STYLE: Record<string, string> = {
  Cours: 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300',
  TD: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  TP: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300',
}

export default function AdminSchedule() {
  const getSession = (day: string, time: string) =>
    ALL_SESSIONS.filter((s) => s.day === day && s.time === time)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">Vue globale de toutes les sessions — Semestre 2 · 2024/2025</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Calendar size={16} />
          Exporter PDF
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-border bg-secondary/50">
          <div className="p-3 text-xs font-semibold text-muted-foreground border-r border-border" />
          {DAYS.map((day) => (
            <div key={day} className="p-3 text-xs font-semibold text-center text-foreground border-r border-border last:border-0">{day}</div>
          ))}
        </div>
        {/* Rows */}
        {TIMES.map((time) => (
          <div key={time} className="grid grid-cols-6 border-b border-border last:border-0">
            <div className="p-3 text-xs text-muted-foreground border-r border-border flex items-start pt-3">{time}</div>
            {DAYS.map((day) => {
              const sessions = getSession(day, time)
              return (
                <div key={day} className="p-1.5 border-r border-border last:border-0 min-h-[80px] space-y-1">
                  {sessions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.03 * i }}
                      className={`p-1.5 rounded-lg border text-xs ${TYPE_STYLE[s.type]}`}
                    >
                      <p className="font-bold leading-tight text-xs">{s.subject}</p>
                      <p className="opacity-70 text-xs">{s.teacher.split(' ')[1] || s.teacher}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="opacity-60">{s.room}</span>
                        <span className="font-semibold">{s.group}</span>
                      </div>
                    </motion.div>
                  ))}
                  {sessions.length === 0 && (
                    <div className="h-full border border-dashed border-border/40 rounded-lg m-0.5" />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </motion.div>
    </>
  )
}
