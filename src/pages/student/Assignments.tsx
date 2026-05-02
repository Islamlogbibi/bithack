import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText, Upload, Send, Clock, AlertCircle, CheckCircle, File, FileImage, Archive } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { StudentUser } from '../../types/domain'
import { getAssignments, submitAssignment } from '../../lib/api'

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return <FileText size={14} className="text-red-500" />
    case 'doc':
    case 'docx':
      return <FileText size={14} className="text-blue-500" />
    case 'txt':
      return <File size={14} className="text-gray-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImage size={14} className="text-green-500" />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive size={14} className="text-yellow-500" />
    default:
      return <File size={14} className="text-gray-500" />
  }
}

interface Assignment {
  id: number
  title: string
  description: string
  module: string
  teacherName: string
  deadline: string
  createdAt: string
  groups?: string[]
}

export default function StudentAssignments() {
  const { user, isReady } = useAuth()
  const student = user as StudentUser
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<number | null>(null)
  const [success, setSuccess] = useState<number | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File>>({})
  const [generalFile, setGeneralFile] = useState<File | null>(null)
  const [generalSubmitting, setGeneralSubmitting] = useState(false)
  const [generalSuccess, setGeneralSuccess] = useState(false)

  useEffect(() => {
    if (!isReady || !student?.group) return
    getAssignments([student.group]).then(setAssignments).finally(() => setLoading(false))
  }, [isReady, student?.group])

  const handleFileSelect = (assignmentId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [assignmentId]: file }))
    }
  }

  const handleFileUpload = async (assignmentId: number) => {
    const file = selectedFiles[assignmentId]
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
      setSelectedFiles(prev => {
        const newFiles = { ...prev }
        delete newFiles[assignmentId]
        return newFiles
      })
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de l\'envoi du fichier.')
    } finally {
      setSubmitting(null)
    }
  }

  const handleGeneralFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setGeneralFile(file)
      setGeneralSuccess(false)
    }
  }

  const handleGeneralFileUpload = async () => {
    if (!generalFile) return

    setGeneralSubmitting(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(generalFile)
      })

      await submitAssignment({
        assignmentId: 0,
        studentId: student.id,
        studentName: student.name,
        fileName: generalFile.name,
        fileContent: base64
      })

      setGeneralSuccess(true)
      setGeneralFile(null)
      setTimeout(() => setGeneralSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de l\'envoi du fichier.')
    } finally {
      setGeneralSubmitting(false)
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
          <div className="col-span-full">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Déposer un fichier</h3>
                  <p className="text-sm text-muted-foreground">Envoyez votre travail directement au professeur.</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Upload libre</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="file"
                    id="general-upload"
                    className="hidden"
                    onChange={handleGeneralFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <label
                    htmlFor="general-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-primary/40 text-sm text-primary cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <FileText size={16} />
                    {generalFile ? generalFile.name : 'Choisir un fichier'}
                  </label>
                  <button
                    onClick={handleGeneralFileUpload}
                    disabled={!generalFile || generalSubmitting}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !generalFile || generalSubmitting
                        ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                        : generalSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {generalSubmitting ? 'Envoi...' : generalSuccess ? 'Envoyé' : 'Téléverser'}
                  </button>
                </div>
                {generalFile && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-slate-50 rounded-xl p-3">
                    {getFileIcon(generalFile.name)}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{generalFile.name}</p>
                      <p>{(generalFile.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      <span>Publié le {new Date(assignment.createdAt).toLocaleDateString()}</span>
                    </div>
                    {selectedFiles[assignment.id] && (
                      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle size={12} />
                        <span>Fichier sélectionné</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* File selection */}
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`file-${assignment.id}`}
                        className="hidden"
                        disabled={isOverdue || submitting === assignment.id}
                        onChange={(e) => handleFileSelect(assignment.id, e)}
                        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                      <label
                        htmlFor={`file-${assignment.id}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border border-dashed border-primary/30 text-primary hover:bg-primary/5"
                      >
                        <FileText size={14} />
                        {selectedFiles[assignment.id] ? selectedFiles[assignment.id].name : 'Choisir fichier'}
                      </label>
                    </div>

                    {/* File info and upload button */}
                    {selectedFiles[assignment.id] && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                        {getFileIcon(selectedFiles[assignment.id].name)}
                        <span className="font-medium">{selectedFiles[assignment.id].name}</span>
                        <span>•</span>
                        <span>{(selectedFiles[assignment.id].size / 1024 / 1024).toFixed(1)} MB</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleFileUpload(assignment.id)}
                      disabled={!selectedFiles[assignment.id] || isOverdue || submitting === assignment.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        success === assignment.id
                          ? 'bg-green-500 text-white'
                          : isOverdue
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                          : !selectedFiles[assignment.id]
                          ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {submitting === assignment.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : success === assignment.id ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Send size={16} />
                      )}
                      {success === assignment.id ? 'Envoyé' : submitting === assignment.id ? 'Envoi...' : 'Envoyer mon travail'}
                    </button>
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
