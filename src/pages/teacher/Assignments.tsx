import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, FileText, Users, Clock, Trash2, Eye, X, Send, CheckCircle, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser } from '../../types/domain'
import { getTeacherAssignments, createAssignment, getAssignmentSubmissions } from '../../lib/api'

const ALL_GROUPS = ['L3 Info G1', 'L3 Info G2', 'L3 Info G3', 'L3 SI G1', 'L3 SI G2']

export default function TeacherAssignments() {
  const { user } = useAuth()
  const teacher = user as TeacherUser | null
  const subjects = teacher?.subjects ?? []
  const teacherName = teacher?.name ?? ''
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    module: subjects[0] || '',
    targetGroups: [] as string[],
    deadline: ''
  })

  useEffect(() => {
    if (!teacherName) {
      setLoading(false)
      return
    }
    refreshAssignments()
  }, [teacherName])

  const refreshAssignments = () => {
    if (!teacherName) {
      setAssignments([])
      setLoading(false)
      return
    }
    getTeacherAssignments(teacherName).then(setAssignments).finally(() => setLoading(false))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createAssignment({
        ...form,
        teacherName,
        targetGroupsJson: form.targetGroups,
        deadline: new Date(form.deadline)
      })
      setShowModal(false)
      setForm({ title: '', description: '', module: subjects[0] || '', targetGroups: [], deadline: '' })
      refreshAssignments()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la création du travail.')
    }
  }

  const viewSubmissions = async (assignment: any) => {
    setSelectedAssignment(assignment)
    setLoadingSubmissions(true)
    try {
      const data = await getAssignmentSubmissions(assignment.id)
      setSubmissions(data)
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const handleDownload = (sub: any) => {
    const byteCharacters = atob(sub.fileContent.split(',')[1] || sub.fileContent)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: sub.fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = sub.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Travaux</h1>
          <p className="text-muted-foreground mt-1">Créez des espaces de rendu pour vos étudiants</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
        >
          <Plus size={20} />
          Nouveau travail
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all cursor-default group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase">
                {assignment.module}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => viewSubmissions(assignment)} className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground">
                  <Eye size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{assignment.title}</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{assignment.targetGroupsJson.length} groupes</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{new Date(assignment.deadline).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => viewSubmissions(assignment)}
              className="w-full py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              Voir les rendus
            </button>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-bold text-foreground">Demander un travail</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-secondary rounded-lg text-muted-foreground">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Titre du travail</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="Ex: Compte-rendu TP 1"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Instructions</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Décrivez ce que les étudiants doivent faire..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Matière</label>
                    <select
                      value={form.module}
                      onChange={e => setForm({...form, module: e.target.value})}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">Date limite</label>
                    <input
                      type="datetime-local"
                      required
                      value={form.deadline}
                      onChange={e => setForm({...form, deadline: e.target.value})}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Groupes ciblés</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-secondary rounded-lg border border-border">
                    {ALL_GROUPS.map(group => (
                      <label key={group} className="flex items-center gap-2 cursor-pointer p-1">
                        <input
                          type="checkbox"
                          checked={form.targetGroups.includes(group)}
                          onChange={e => {
                            const newGroups = e.target.checked 
                              ? [...form.targetGroups, group]
                              : form.targetGroups.filter(g => g !== group)
                            setForm({...form, targetGroups: newGroups})
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-xs text-foreground">{group}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Publier l'espace de rendu
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submissions Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedAssignment.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Rendus des étudiants</p>
                </div>
                <button onClick={() => setSelectedAssignment(null)} className="p-1 hover:bg-secondary rounded-lg text-muted-foreground">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {loadingSubmissions ? (
                  <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">Aucun rendu reçu pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border group hover:border-primary/30 transition-all">
                        <div>
                          <p className="font-bold text-foreground">{sub.studentName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <FileText size={12} />
                            <span>{sub.fileName}</span>
                            <span>•</span>
                            <Clock size={12} />
                            <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(sub)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary text-primary hover:text-white transition-all"
                        >
                          <Download size={14} />
                          Télécharger
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
