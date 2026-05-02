import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserRound, BookOpen, Users, Plus, X, CheckCircle, Save, Download } from 'lucide-react'
import { getTeachers, updateTeacher } from '../../lib/api'
import { ProfessorRow } from '../../types/domain'
import { mockAdminProfessors } from '../../data/mockAdmin'

export default function AdminProfessors() {
  const [query, setQuery] = useState('')
  const [professors, setProfessors] = useState<ProfessorRow[]>(mockAdminProfessors)
  const [loading, setLoading] = useState(true)
  const [selectedProf, setSelectedProf] = useState<ProfessorRow | null>(null)
  const [editingData, setEditingData] = useState<{ subjects: string[]; groups: string[] }>({ subjects: [], groups: [] })
  const [isSaving, setIsSaving] = useState(false)

  const fetchTeachers = () => {
    setLoading(true)
    getTeachers()
      .then(data => {
        if (Array.isArray(data)) {
          setProfessors(data.map(t => ({
            id: t.id,
            name: t.user.fullName,
            department: t.department,
            email: t.user.email,
            completedHours: t.hoursCompleted,
            plannedHours: t.hoursPlanned,
            subjects: t.subjectsJson || [],
            groups: t.groupsJson || []
          })))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filtered = useMemo(
    () => professors.filter((prof) => prof.name.toLowerCase().includes(query.toLowerCase())),
    [query, professors]
  )

  const handleOpenEdit = (prof: ProfessorRow) => {
    setSelectedProf(prof)
    setEditingData({
      subjects: [...prof.subjects],
      groups: [...prof.groups]
    })
  }

  const handleSave = async () => {
    if (!selectedProf) return
    setIsSaving(true)
    try {
      await updateTeacher(selectedProf.id, {
        subjectsJson: editingData.subjects,
        groupsJson: editingData.groups
      })
      setSelectedProf(null)
      fetchTeachers()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="mb-6 max-w-lg relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un enseignant..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
          {filtered.map((prof, i) => (
            <motion.div
              key={prof.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <UserRound size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{prof.name}</p>
                    <p className="text-xs text-muted-foreground">{prof.department}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{prof.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenEdit(prof)}
                  className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  Gérer
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                      <BookOpen size={10} /> Matières
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.subjects.map((s: string) => (
                        <span key={s} className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold">
                          {s}
                        </span>
                      ))}
                      {prof.subjects.length === 0 && <span className="text-[10px] text-muted-foreground italic">Aucune</span>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Users size={10} /> Groupes
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.groups.map((g: string) => (
                        <span key={g} className="px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-bold">
                          {g}
                        </span>
                      ))}
                      {prof.groups.length === 0 && <span className="text-[10px] text-muted-foreground italic">Aucun</span>}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1.5">
                    <span>Progression charge horaire</span>
                    <span>{prof.completedHours}h / {prof.plannedHours}h</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (prof.completedHours / prof.plannedHours) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-[10px] text-muted-foreground">Télécharger le CV académique</div>
                  <a
                    href={prof.cv}
                    download
                    className="inline-flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-full text-xs font-semibold text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <Download size={14} /> CV
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedProf && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedProf.name}</h3>
                    <p className="text-xs text-muted-foreground">Assignation des modules et groupes</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProf(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Subjects */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Matières assignées</label>
                    <button 
                      onClick={() => {
                        const s = prompt('Nom du module :')
                        if (s) setEditingData(prev => ({ ...prev, subjects: [...prev.subjects, s] }))
                      }}
                      className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      <Plus size={12} /> Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-secondary rounded-xl border border-border">
                    {editingData.subjects.map((s, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20">
                        {s}
                        <button onClick={() => setEditingData(prev => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== idx) }))}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {editingData.subjects.length === 0 && <p className="text-xs text-muted-foreground italic">Aucune matière assignée</p>}
                  </div>
                </div>

                {/* Groups */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Groupes assignés</label>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setEditingData(prev => ({ ...prev, groups: [...new Set([...prev.groups, 'Group A'])] }))}
                        className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-md"
                      >
                        + A
                      </button>
                      <button 
                        onClick={() => setEditingData(prev => ({ ...prev, groups: [...new Set([...prev.groups, 'Group B'])] }))}
                        className="text-[10px] font-bold px-2 py-1 bg-secondary rounded-md"
                      >
                        + B
                      </button>
                      <button 
                        onClick={() => {
                          const g = prompt('Nom du groupe (ex: L3 Info G1) :')
                          if (g) setEditingData(prev => ({ ...prev, groups: [...prev.groups, g] }))
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                      >
                        <Plus size={12} /> Autre
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-secondary rounded-xl border border-border">
                    {editingData.groups.map((g, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20">
                        {g}
                        <button onClick={() => setEditingData(prev => ({ ...prev, groups: prev.groups.filter((_, i) => i !== idx) }))}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {editingData.groups.length === 0 && <p className="text-xs text-muted-foreground italic">Aucun groupe assigné</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setSelectedProf(null)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-muted transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-2 flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                  Enregistrer les modifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
