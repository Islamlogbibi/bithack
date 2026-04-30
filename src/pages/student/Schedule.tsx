import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, List, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StudentUser } from '../../data/users'

const DAYS = ['Samedi','Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']
const TIME_SLOTS = ['08:00', '9:45', '11:30', '14:00', '15:45', '17:15']

const TYPE_STYLE: Record<string, string> = {
  Cours: 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-300',
  TD: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300',
  TP: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300',
}

export default function StudentSchedule() {
  const { user } = useAuth()
  const student = user as StudentUser
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const getSession = (day: string, time: string) => {
    return student.schedule.find((s) => s.day === day && s.time === time)
  }

  return (
    <>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Calendar size={16} /> Semaine
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List size={16} /> Liste
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download size={16} />
          Exporter iCal / PDF
        </button>
      </div>

      {view === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-7 border-b border-border">
            <div className="p-3 text-xs font-semibold text-muted-foreground border-r border-border" />
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-xs font-semibold text-center text-foreground border-r border-border last:border-0">
                {day}
              </div>
            ))}
          </div>
          {/* Time slots */}
          {TIME_SLOTS.map((time) => (
            <div key={time} className="grid grid-cols-7 border-b border-border last:border-0">
              <div className="p-3 text-xs text-muted-foreground border-r border-border flex items-center">{time}</div>
              {DAYS.map((day) => {
                const session = getSession(day, time)
                return (
                  <div key={day} className="p-2 border-r border-border last:border-0 min-h-[72px]">
                    {session ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.03 }}
                        className={`h-full p-2 rounded-lg border text-xs ${TYPE_STYLE[session.type]}`}
                      >
                        <p className="font-bold text-sm leading-tight">{session.subject}</p>
                        <p className="mt-0.5 opacity-80">{session.room}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-current/10 rounded text-xs font-semibold">
                          {session.type}
                        </span>
                      </motion.div>
                    ) : (
                      <div className="h-full border border-dashed border-border/50 rounded-lg" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {DAYS.map((day) => {
            const daySessions = student.schedule.filter((s) => s.day === day)
            if (daySessions.length === 0) return null
            return (
              <div key={day}>
                <h3 className="text-sm font-bold text-muted-foreground mb-2 px-1">{day}</h3>
                <div className="space-y-2">
                  {daySessions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${TYPE_STYLE[s.type]}`}
                    >
                      <div className="text-center w-14">
                        <p className="text-sm font-bold">{s.time}</p>
                        <p className="text-xs opacity-70">1.5h</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{s.subject}</p>
                        <p className="text-xs mt-0.5 opacity-70">{s.room}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-current/10 rounded-md">{s.type}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </>
  )
}
