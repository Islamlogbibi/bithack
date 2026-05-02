import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, X, Save, Trash2, Download } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { getAllSchedules, createSchedule } from '../../lib/api'

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Samedi']
const TIMES = ['08:00', '09:45', '11:30', '14:00', '15:45']

const TYPE_STYLE: Record<string, string> = {
  Cours: 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300',
  TD: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  TP: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300',
}

export default function AdminSchedule() {
  const [filters, setFilters] = useState({
    specialite: 'Info',
    level: 'L1',
    group: 'G1',
  })

  const currentScopeId = `${filters.specialite} ${filters.level} ${filters.group}`
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSession, setNewSession] = useState({
    day: 'Dimanche',
    time: '08:00',
    subject: '',
    room: '',
    type: 'Cours',
    scope: 'group',
    scopeId: 'Group A'
  })

  const fetchSchedules = () => {
    setLoading(true)
    getAllSchedules()
      .then(setSchedules)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const filteredSessions = useMemo(
    () => schedules.filter((session) => session.groupName === currentScopeId || session.scopeId === currentScopeId),
    [currentScopeId, schedules]
  )

  const getSession = (day: string, time: string) =>
    filteredSessions.filter((s) => s.day === day && (s.time === time || s.timeSlot === time))

  const handleAdd = async () => {
    try {
      await createSchedule({ ...newSession, scopeId: currentScopeId, group: currentScopeId })
      setShowAddModal(false)
      fetchSchedules()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <select 
            value={filters.specialite} 
            onChange={(e) => setFilters({ ...filters, specialite: e.target.value })} 
            className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="Info">Info</option>
            <option value="Auto">Auto</option>
          </select>
          <select 
            value={filters.level} 
            onChange={(e) => setFilters({ ...filters, level: e.target.value })} 
            className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
          <select 
            value={filters.group} 
            onChange={(e) => setFilters({ ...filters, group: e.target.value })} 
            className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="G1">G1</option>
            <option value="G2">G2</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Ajouter une session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="grid grid-cols-7 border-b border-border bg-secondary/50">
            <div className="p-3 text-[10px] font-black uppercase text-muted-foreground border-r border-border" />
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-[10px] font-black uppercase text-center text-foreground border-r border-border last:border-0">{day}</div>
            ))}
          </div>
          {TIMES.map((time) => (
            <div key={time} className="grid grid-cols-7 border-b border-border last:border-0">
              <div className="p-3 text-[10px] font-bold text-muted-foreground border-r border-border flex items-start pt-4">{time}</div>
              {DAYS.map((day) => {
                const sessions = getSession(day, time)
                return (
                  <div key={day} className="p-1.5 border-r border-border last:border-0 min-h-[100px] space-y-1 bg-secondary/10">
                    {sessions.map((s, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border text-xs shadow-sm ${TYPE_STYLE[s.type || s.sessionType]}`}
                      >
                        <p className="font-bold leading-tight">{s.subject}</p>
                        <p className="opacity-70 text-[10px] mt-0.5">{s.room}</p>
                        <div className="flex items-center justify-between mt-1 text-[9px] font-black uppercase">
                          <span>{s.type || s.sessionType}</span>
                        </div>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <div className="h-full border border-dashed border-border/20 rounded-lg" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </motion.div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-foreground">Nouvelle session - {currentScopeId}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Jour</label>
                    <select 
                      value={newSession.day} 
                      onChange={e => setNewSession({...newSession, day: e.target.value})}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none"
                    >
                      {DAYS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Heure</label>
                    <select 
                      value={newSession.time} 
                      onChange={e => setNewSession({...newSession, time: e.target.value})}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none"
                    >
                      {TIMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground">Matière</label>
                  <input 
                    type="text" 
                    value={newSession.subject}
                    onChange={e => setNewSession({...newSession, subject: e.target.value})}
                    placeholder="ex: Algorithmique"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Salle</label>
                    <input 
                      type="text" 
                      value={newSession.room}
                      onChange={e => setNewSession({...newSession, room: e.target.value})}
                      placeholder="ex: Amphi A"
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Type</label>
                    <select 
                      value={newSession.type} 
                      onChange={e => setNewSession({...newSession, type: e.target.value})}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none"
                    >
                      <option>Cours</option>
                      <option>TD</option>
                      <option>TP</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-muted"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleAdd}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90"
                >
                  Ajouter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
