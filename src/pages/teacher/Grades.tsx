import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Search, UserRound, GraduationCap, ArrowRight, RefreshCw, Layers } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser, PendingGrade, SpecialityTreeRoot } from '../../types/domain'
import { apiPost, apiGet, getStudentsByGroup } from '../../lib/api'

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
  
  const [tree, setTree] = useState<SpecialityTreeRoot[]>([])
  const [selectedSpec, setSelectedSpec] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedModule, setSelectedModule] = useState('')

  const [grades, setGrades] = useState<(PendingGrade & { examInput: string })[]>([])
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Fetch Speciality Tree
  useEffect(() => {
    apiGet<SpecialityTreeRoot[]>('/specialities/tree').then(setTree).catch(console.error)
  }, [])

  // Options for cascading dropdowns
  const levelOptions = useMemo(() => {
    const spec = tree.find(s => s.speciality === selectedSpec)
    return spec ? spec.levels : []
  }, [tree, selectedSpec])

  const sectionOptions = useMemo(() => {
    const level = levelOptions.find(l => l.level === selectedLevel)
    return level ? level.sections : []
  }, [levelOptions, selectedLevel])

  const groupOptions = useMemo(() => {
    const section = sectionOptions.find(s => s.section === selectedSection)
    return section ? section.groups : []
  }, [sectionOptions, selectedSection])

  // Automatic Module Detection
  useEffect(() => {
    if (selectedGroup && teacher?.subjects) {
      // In a real scenario, we'd map teacher assignments. 
      // For now, we take the first subject assigned to the teacher as default module for this group.
      setSelectedModule(teacher.subjects[0] || '')
    }
  }, [selectedGroup, teacher])

  const fetchStudents = useCallback(async () => {
    if (!selectedGroup || !teacher?.name) return
    setLoading(true)
    try {
      const [studentsData, validationsData] = await Promise.all([
        getStudentsByGroup(selectedGroup),
        apiGet<any[]>('/validations')
      ])

      const pendingVal = Array.isArray(validationsData) ? validationsData.find(v => 
        v.status === 'pending' && 
        v.teacherName === teacher.name && 
        v.module === selectedModule && 
        v.groupName === selectedGroup
      ) : null

      if (Array.isArray(studentsData)) {
        const mapped = studentsData.map(s => {
          const existingModuleGrade = s.gradesJson?.find((g: any) => g.subject === selectedModule)
          const pendingGradeEntry = pendingVal?.studentGradesJson?.find((pg: any) => pg.matricule === s.matricule)

          return {
            student: s.user?.fullName || 'Étudiant sans nom',
            matricule: s.matricule,
            group: s.groupName,
            td: existingModuleGrade?.td || 12,
            exam: existingModuleGrade?.exam || null,
            status: pendingVal ? 'Soumis (Attente)' : (existingModuleGrade?.status || 'En attente'),
            tdInput: pendingGradeEntry ? String(pendingGradeEntry.td) : (existingModuleGrade?.td !== undefined ? String(existingModuleGrade.td) : '12'),
            examInput: pendingGradeEntry ? String(pendingGradeEntry.grade) : (existingModuleGrade?.exam !== null && existingModuleGrade?.exam !== undefined ? String(existingModuleGrade.exam) : '')
          }
        })
        setGrades(mapped as any)
        if (mapped.length > 0) setSubmitted(false)
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedGroup, selectedModule, teacher?.name])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleRefresh = async () => {
    await refreshProfile()
    await fetchStudents()
  }

  const updateGrade = (idx: number, field: 'tdInput' | 'examInput', val: string) => {
    setGrades((prev) => prev.map((g, i) => i === idx ? { ...g, [field]: val } : g))
  }

  const getAvg = (tdStr: string, examStr: string) => {
    const td = parseFloat(tdStr)
    const exam = parseFloat(examStr)
    if (isNaN(td) || isNaN(exam)) return null
    return Math.round((td * 0.4 + exam * 0.6) * 10) / 10
  }

  const readyCount = grades.filter((g: any) => g.examInput !== '' && !isNaN(parseFloat(g.examInput))).length

  const handleSubmit = async () => {
    setShowConfirm(false)
    try {
      const studentGradesJson = grades
        .filter((g: any) => g.examInput !== '' && !isNaN(parseFloat(g.examInput)))
        .map((g: any) => ({
          student: g.student,
          matricule: g.matricule,
          td: parseFloat(g.tdInput),
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
        <button onClick={() => setSubmitted(false)} className="mt-8 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all">Saisir d'autres notes</button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-100 text-xs font-bold uppercase tracking-wider">
              <GraduationCap size={14} /> Portail Enseignant
            </div>
            <button onClick={handleRefresh} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          </div>
          <h2 className="text-2xl font-black mb-6">Saisie des Notes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Spécialité</label>
              <select value={selectedSpec} onChange={(e) => { setSelectedSpec(e.target.value); setSelectedLevel(''); setSelectedSection(''); setSelectedGroup(''); }} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none">
                <option value="" className="text-slate-900">Choisir...</option>
                {tree.map(s => <option key={s.speciality} value={s.speciality} className="text-slate-900">{s.speciality}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Niveau</label>
              <select value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); setSelectedSection(''); setSelectedGroup(''); }} disabled={!selectedSpec} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none disabled:opacity-50">
                <option value="" className="text-slate-900">Choisir...</option>
                {levelOptions.map(l => <option key={l.level} value={l.level} className="text-slate-900">{l.level}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Section</label>
              <select value={selectedSection} onChange={(e) => { setSelectedSection(e.target.value); setSelectedGroup(''); }} disabled={!selectedLevel} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none disabled:opacity-50">
                <option value="" className="text-slate-900">Choisir...</option>
                {sectionOptions.map(s => <option key={s.section} value={s.section} className="text-slate-900">Section {s.section}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Groupe</label>
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} disabled={!selectedSection} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none disabled:opacity-50">
                <option value="" className="text-slate-900">Choisir...</option>
                {groupOptions.map(g => <option key={g.group} value={g.group} className="text-slate-900">{g.group}</option>)}
              </select>
            </div>
          </div>

          {selectedGroup && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-200"><Layers size={20} /></div>
              <div>
                <p className="text-[10px] font-bold text-blue-300 uppercase">Module détecté</p>
                <p className="text-sm font-bold">{selectedModule}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Chargement des étudiants...</p>
        </div>
      ) : selectedGroup && grades.length === 0 ? (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
           <Search size={40} className="mx-auto mb-4 text-muted-foreground opacity-20" />
           <h3 className="text-lg font-bold text-foreground">Aucun étudiant trouvé</h3>
           <p className="text-sm text-muted-foreground">Vérifiez les critères de sélection ou actualisez la liste.</p>
        </div>
      ) : selectedGroup ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Étudiant</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Matricule</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">TD</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Examen</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Moyenne</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest">Appréciation</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g: any, i: number) => {
                  const avg = getAvg(g.tdInput, g.examInput)
                  return (
                    <tr key={g.matricule} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black text-primary">{g.student.charAt(0)}</div>
                          <p className="font-bold text-foreground">{g.student}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-mono text-muted-foreground">{g.matricule}</td>
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="number" 
                          value={g.tdInput} 
                          onChange={(e) => updateGrade(i, 'tdInput', e.target.value)} 
                          className="w-16 text-center px-2 py-2 bg-secondary border border-border rounded-xl text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none" 
                          placeholder="0.00" 
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="number" 
                          value={g.examInput} 
                          onChange={(e) => updateGrade(i, 'examInput', e.target.value)} 
                          className="w-20 text-center px-2 py-2 bg-secondary border border-border rounded-xl text-sm font-black focus:ring-2 focus:ring-primary/20 outline-none" 
                          placeholder="0.00" 
                        />
                      </td>
                      <td className="px-4 py-4 text-center font-black text-base">{avg !== null ? <span className={getAppColor(avg)}>{avg.toFixed(1)}</span> : '--.-'}</td>
                      <td className="px-4 py-4 text-center">
                        {avg !== null && <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md bg-secondary border border-border ${getAppColor(avg)}`}>{getAppreciation(avg)}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-secondary/30 border-t border-border flex items-center justify-between">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-bold">
               <UserRound size={14} /> {readyCount} / {grades.length} Saisis
             </div>
             <button onClick={() => setShowConfirm(true)} disabled={readyCount === 0} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
               Soumettre à l'Admin <ArrowRight size={18} />
             </button>
          </div>
        </motion.div>
      ) : (
        <div className="py-20 text-center text-muted-foreground bg-card border border-border border-dashed rounded-3xl">
          <Layers size={40} className="mx-auto mb-4 opacity-10" />
          <p className="text-sm font-medium">Veuillez sélectionner une spécialité et un groupe pour commencer la saisie.</p>
        </div>
      )}

      {/* Modal Confirmation */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <AlertTriangle size={32} className="text-amber-500 mb-6" />
              <h3 className="text-xl font-black text-foreground mb-3">Confirmer la soumission ?</h3>
              <p className="text-sm text-muted-foreground mb-8">Les notes seront envoyées pour validation administrative.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-secondary text-foreground rounded-xl font-bold">Annuler</button>
                <button onClick={handleSubmit} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-black">Confirmer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
