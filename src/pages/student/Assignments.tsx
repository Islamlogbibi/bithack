import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, Upload, Send, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { StudentUser } from '../../types/domain'
import { getAssignments, submitAssignment } from '../../lib/api'

interface Assignment {
  id: number
  title: string
  description: string
  module: string
  teacherName: string
  deadline: string
  createdAt: string
}

export default function StudentAssignments() {
  const { user, isReady } = useAuth()
  const student = user as StudentUser
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<number | null>(null)
  const [success, setSuccess] = useState<number | null>(null)

  useEffect(() => {
    if (!isReady || !student?.group) return
    getAssignments([student.group]).then(setAssignments).finally(() => setLoading(false))
  }, [isReady, student?.group])

  const handleFileUpload = async (assignmentId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSubmitting(assignmentId)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      await submitAssignment({
        assignmentId,
        studentId: student.id,
        studentName: student.name,
        fileName: file.name,
        fileContent: base64
      })

      setSuccess(assignmentId)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de l\'envoi du fichier.')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Travaux à rendre</h1>
        <p className="text-muted-foreground mt-1">
          Consultez et soumettez vos devoirs et comptes rendus
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full bg-card border border-border rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Aucun travail demandé pour le moment.</p>
          </div>
        ) : (
          assignments.map((assignment) => {
            const deadline = new Date(assignment.deadline)
            const isOverdue = deadline < new Date()
            
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase">
                      {assignment.module}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-2">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Par {assignment.teacherName}</p>
                  </div>
                  <div className={`flex flex-col items-end ${isOverdue ? 'text-red-500' : 'text-amber-500'}`}>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <Clock size={14} />
                      <span>{isOverdue ? 'Délai dépassé' : 'À rendre avant'}</span>
                    </div>
                    <p className="text-sm font-bold mt-1">
                      {deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {assignment.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    <span>Publié le {new Date(assignment.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      id={`file-${assignment.id}`}
                      className="hidden"
                      disabled={isOverdue || submitting === assignment.id}
                      onChange={(e) => handleFileUpload(assignment.id, e)}
                    />
                    <label
                      htmlFor={`file-${assignment.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        success === assignment.id
                          ? 'bg-green-500 text-white'
                          : isOverdue
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {submitting === assignment.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : success === assignment.id ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Upload size={16} />
                      )}
                      {success === assignment.id ? 'Envoyé' : submitting === assignment.id ? 'Envoi...' : 'Envoyer mon travail'}
                    </label>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
