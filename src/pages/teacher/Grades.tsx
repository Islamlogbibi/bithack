import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X, Search, UserRound, GraduationCap, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser, PendingGrade } from '../../types/domain'
import { apiPost, getStudentsByGroup } from '../../lib/api'

function getAppreciation(avg: number): string {
  if (avg >= 16) return 'Excellent'
  if (avg >= 14) return 'Très Bien'
  if (avg >= 12) return 'Bien'
  if (avg >= 10) return 'Assez Bien'
  return 'Insuffisant'
}

function getAppColor(avg: number): string {
  if (avg >= 14) return 'text-emerald-500'
  if (avg >= 10) return 'text-amber-500'
  return 'text-red-500'
}

export default function TeacherGrades() {
  const { user, refreshProfile } = useAuth()
  const teacher = user as TeacherUser
  
  const [selectedModule, setSelectedModule] = useState(teacher?.subjects?.[0] || '')
  const [selectedGroup, setSelectedGroup] = useState(teacher?.groups?.[0] || '')
  const [grades, setGrades] = useState<(PendingGrade & { examInput: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Sync selection with teacher data
  useEffect(() => {
    if (teacher?.subjects?.length > 0 && !selectedModule) {
      setSelectedModule(teacher.subjects[0])
    }
    if (teacher?.groups?.length > 0 && !selectedGroup) {
      setSelectedGroup(teacher.groups[0])
    }
  }, [teacher, selectedModule, selectedGroup])

  const fetchStudents = useCallback(async () => {
    if (!selectedGroup) return
    setLoading(true)
    try {
      const data = await getStudentsByGroup(selectedGroup)
      if (Array.isArray(data)) {
        setGrades(data.map(s => {
          const existingModuleGrade = s.gradesJson?.find((g: any) => g.subject === selectedModule)
          return {
            student: s.user?.fullName || 'Étudiant sans nom',
            matricule: s.matricule,
            group: s.groupName,
            td: existingModuleGrade?.td || 12,
            exam: null,
            status: 'En attente',
            examInput: ''
          }
        }))
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedGroup, selectedModule])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleRefresh = async () => {
    await refreshProfile()
    await fetchStudents()
  }

  const updateExam = (idx: number, val: string) => {
    setGrades((prev) => prev.map((g, i) => i === idx ? { ...g, examInput: val } : g))
  }

  const getAvg = (td: number, exam: string) => {
    const e = parseFloat(exam)
    if (isNaN(e)) return null
    return Math.round((td * 0.4 + e * 0.6) * 10) / 10
  }

  const readyCount = grades.filter((g) => g.examInput !== '' && !isNaN(parseFloat(g.examInput))).length

  const handleSubmit = async () => {
    setShowConfirm(false)
    try {
      const studentGradesJson = grades
        .filter(g => g.examInput !== '' && !isNaN(parseFloat(g.examInput)))
        .map(g => ({
          student: g.student,
          matricule: g.matricule,
          grade: parseFloat(g.examInput),
        }))
      
      await apiPost('/validations', {
        teacherName: teacher.name,
        module: selectedModule,
        groupName: selectedGroup,
        count: studentGradesJson.length,
        slaHours: 24,
        studentGradesJson,
        status: 'pending',
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit grades:', err)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Notes envoyées !</h2>
        <p className="text-muted-foreground max-w-md">
          Les notes du groupe <span className="font-bold text-foreground">{selectedGroup}</span> pour le module <span className="font-bold text-foreground">{selectedModule}</span> ont été envoyées à l'administration pour validation.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
        >
          Saisir d'autres notes
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header Info */}
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-100 text-xs font-bold uppercase tracking-wider">
              <GraduationCap size={14} />
              Portail de Saisie des Notes
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all"
              title="Actualiser mes groupes et étudiants"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
          <h2 className="text-2xl font-black mb-4">Saisie des Notes d'Examen</h2>
          <div className="flex flex-wrap gap-4">
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="block w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:bg-white/20 transition-all cursor-pointer"
              >
                {teacher?.subjects?.map((s) => <option key={s} className="text-slate-900">{s}</option>)}
                {(!teacher?.subjects || teacher.subjects.length === 0) && <option>Aucun module</option>}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Groupe</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="block w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:bg-white/20 transition-all cursor-pointer"
              >
                {teacher?.groups?.map((g) => <option key={g} className="text-slate-900">{g}</option>)}
                {(!teacher?.groups || teacher.groups.length === 0) && <option>Aucun groupe</option>}
              </select>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute right-10 top-5 opacity-20 text-white">
          <GraduationCap size={120} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Chargement de la liste des étudiants...</p>
        </div>
      ) : grades.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
           <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
             <Search size={30} />
           </div>
           <h3 className="text-lg font-bold text-foreground mb-1">Aucun étudiant trouvé</h3>
           <p className="text-sm text-muted-foreground mb-6">Il n'y a aucun étudiant inscrit dans le groupe "{selectedGroup || 'non sélectionné'}".</p>
           <button 
             onClick={handleRefresh}
             className="px-4 py-2 bg-secondary text-foreground rounded-lg text-xs font-bold hover:bg-border transition-all flex items-center gap-2 mx-auto"
           >
             <RefreshCw size={14} />
             Réessayer
           </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Étudiant</th>
                  <th className="text-center px-4 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Matricule</th>
                  <th className="text-center px-4 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Note TD</th>
                  <th className="text-center px-4 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Note Examen</th>
                  <th className="text-center px-4 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Moyenne</th>
                  <th className="text-center px-4 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Appréciation</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => {
                  const avg = getAvg(g.td, g.examInput)
                  return (
                    <tr key={g.matricule} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                            {g.student.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{g.student}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{g.group}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-mono text-muted-foreground">{g.matricule}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2.5 py-1 bg-secondary rounded-lg font-bold text-foreground border border-border">
                          {g.td}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          step={0.25}
                          value={g.examInput}
                          onChange={(e) => updateExam(i, e.target.value)}
                          placeholder="00.00"
                          className="w-20 text-center px-2 py-2 bg-secondary border border-border rounded-xl text-sm font-black text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-base font-black ${avg !== null ? getAppColor(avg) : 'text-muted-foreground/30'}`}>
                          {avg !== null ? avg.toFixed(1) : '--.-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {avg !== null ? (
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md bg-secondary border border-border ${getAppColor(avg)}`}>
                            {getAppreciation(avg)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-muted-foreground/50">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-secondary/30 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold">
                  <UserRound size={14} />
                  {readyCount} / {grades.length} Étudiants saisis
                </div>
                {readyCount < grades.length && (
                  <p className="text-[10px] text-muted-foreground font-bold italic">
                    Note: vous pouvez soumettre une liste partielle
                  </p>
                )}
             </div>
             <button
               onClick={() => setShowConfirm(true)}
               disabled={readyCount === 0}
               className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
             >
               Soumettre à l'Admin
               <ArrowRight size={18} />
             </button>
          </div>
        </motion.div>
      )}

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3">Confirmer la soumission ?</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Vous êtes sur le point d'envoyer les notes de <span className="font-bold text-foreground">{readyCount} étudiants</span> pour validation. 
                Une fois validées par l'administrateur, ces notes seront définitives et visibles par les étudiants.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold hover:bg-muted"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
