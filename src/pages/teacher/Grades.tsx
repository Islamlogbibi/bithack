import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser, PendingGrade } from '../../types/domain'
import { apiPost } from '../../lib/api'

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
  const { user } = useAuth()
  const teacher = user as TeacherUser
  const [selectedModule, setSelectedModule] = useState(teacher.subjects[0])
  const [selectedGroup, setSelectedGroup] = useState(teacher.groups[0])
  const [grades, setGrades] = useState<(PendingGrade & { examInput: string })[]>(
    teacher.pendingGrades.map((g) => ({ ...g, examInput: g.exam !== null ? String(g.exam) : '' }))
  )
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
          grade: getAvg(g.td, g.examInput) ?? 0,
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

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {teacher.subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {teacher.groups.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      {/* Warning banner */}
      {grades.some((g) => g.td < 10 || parseFloat(g.examInput) < 10) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3"
        >
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={18} />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Note anormale détectée: Omar Bensalem (TD: 9/20) — vérifiez avant soumission.
          </p>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden mb-4"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Étudiant</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Matricule</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Groupe</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">TD /20</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Examen /20</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Moyenne</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Appréciation</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, i) => {
                const avg = getAvg(g.td, g.examInput)
                return (
                  <tr key={g.matricule} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {g.student.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{g.student}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground text-xs">{g.matricule}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 bg-secondary rounded-md text-xs font-medium text-foreground">{g.group}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${g.td >= 14 ? 'text-emerald-500' : g.td >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
                        {g.td}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.5}
                        value={g.examInput}
                        onChange={(e) => updateExam(i, e.target.value)}
                        placeholder="—"
                        className={`w-16 text-center px-2 py-1 bg-secondary border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                          g.examInput !== '' && (parseFloat(g.examInput) < 0 || parseFloat(g.examInput) > 20) 
                            ? 'border-red-500 animate-pulse' 
                            : 'border-border'
                        }`}
                      />
                      {g.examInput !== '' && (parseFloat(g.examInput) < 0 || parseFloat(g.examInput) > 20) && (
                        <p className="text-[10px] text-red-500 mt-1 font-bold">Invalide</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {avg !== null ? (
                        <span className={`text-base font-bold ${getAppColor(avg)}`}>{avg}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {avg !== null ? (
                        <span className={`text-xs font-semibold ${getAppColor(avg)}`}>{getAppreciation(avg)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{readyCount}</span> / {grades.length} notes saisies
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowConfirm(true)}
          disabled={readyCount === 0 || submitted}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50"
        >
          {submitted ? <CheckCircle size={16} /> : null}
          {submitted ? 'Soumis avec succès' : `Soumettre ${readyCount} notes pour validation`}
        </motion.button>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-lg">Confirmer la soumission</h3>
                <button onClick={() => setShowConfirm(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Vous êtes sur le point de soumettre <span className="font-bold text-foreground">{readyCount} notes</span> pour le module{' '}
                <span className="font-bold text-primary">{selectedModule}</span> — {selectedGroup}. Cette action sera envoyée à l&apos;administration pour validation.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 bg-secondary rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  Annuler
                </button>
                <button onClick={handleSubmit} className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-semibold">
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
