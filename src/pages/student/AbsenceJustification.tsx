import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, FileText, Upload, Send, AlertCircle, FileDown, Eye, X, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { StudentUser } from '../../types/domain'
import { getJustifications, createJustification } from '../../lib/api'
import { useEffect } from 'react'

const DAYS = ['Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']
const TIME_SLOTS = ['08:00', '9:45', '11:30', '14:00', '15:45', '17:15']

const SUBJECT_NAMES: Record<string, string> = {
  algo: 'Algorithmique',
  networks: 'Réseaux',
  db: 'Base de Données',
  web: 'Développement Web',
  math: 'Mathématiques',
}

const REASON_LABELS: Record<string, string> = {
  medical: 'Motif médical',
  family: 'Événements familiaux',
  transport: 'Problème de transport',
  technical: 'Problème technique',
  other: 'Autre motif',
}

interface JustificationForm {
  date: string
  day: string
  time: string
  subject: string
  reason: string
  file: File | null
  description: string
}

interface JustificationHistory {
  id: string
  date: string
  day: string
  time: string
  subject: string
  reason: string
  description: string
  fileName: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewComment?: string
  fileContent?: string
}

  // Mock history removed in favor of state

const REASON_OPTIONS = [
  { value: 'medical', label: 'Motif médical' },
  { value: 'family', label: 'Événements familiaux' },
  { value: 'transport', label: 'Problème de transport' },
  { value: 'technical', label: 'Problème technique' },
  { value: 'other', label: 'Autre motif' },
]

function StatusBadge({ status }: { status: JustificationHistory['status'] }) {
  const styles = {
    pending: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
    approved: 'bg-green-500/15 text-green-600 dark:text-green-400',
    rejected: 'bg-red-500/15 text-red-600 dark:text-red-400',
  }
  const labels = {
    pending: 'En attente',
    approved: 'Approuvée',
    rejected: 'Refusée',
  }
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default function AbsenceJustification() {
  const { user, isReady } = useAuth()
  const student = user as StudentUser

  const [view, setView] = useState<'form' | 'history'>('form')
  const [selectedItem, setSelectedItem] = useState<JustificationHistory | null>(null)
  const [history, setHistory] = useState<JustificationHistory[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<JustificationForm>({
    date: '',
    day: '',
    time: '',
    subject: '',
    reason: '',
    file: null,
    description: '',
  })

  useEffect(() => {
    if (!isReady || !student?.id) return
    getJustifications().then(data => {
      // Filter for current student and map to match interface
      const studentData = data
        .filter((j: any) => j.student?.user?.id === student.id)
        .map((j: any) => ({
          id: String(j.id),
          date: j.absenceDate || new Date(j.submittedAt).toISOString().split('T')[0],
          day: j.absenceDay || '-',
          time: j.absenceTime || '-',
          subject: j.module,
          reason: j.reason || 'other',
          description: j.description || '',
          fileName: j.fileName,
          status: j.status,
          submittedAt: j.submittedAt,
          reviewComment: j.reviewComment,
          fileContent: j.fileContent
        }))
      setHistory(studentData)
    }).catch(console.error)
  }, [isReady, student?.id])

  const handleDownload = (item: JustificationHistory | string) => {
    const fileName = typeof item === 'string' ? item : item.fileName
    const content = typeof item === 'string' ? null : item.fileContent

    let blob: Blob
    if (content) {
      const byteCharacters = atob(content.split(',')[1] || content)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      blob = new Blob([byteArray], { type: fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg' })
    } else {
      // Fallback to simulated PDF if no content
      const pdfData = `%PDF-1.4\n1 0 obj\n<< /Title (${fileName}) /Creator (OSCA Hackathon) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n3 0 obj\n<< /Type /Pages /Count 1 /Kids [4 0 R] >>\nendobj\n4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (${fileName}) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000079 00000 n\n0000000128 00000 n\n0000000188 00000 n\n0000000282 00000 n\ntrailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n377\n%%EOF`
      blob = new Blob([pdfData], { type: 'application/pdf' })
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getSession = (day: string, time: string) => {
    return student.schedule.find((s) => s.day === day && s.time === time)
  }

  const handleDayChange = (day: string) => {
    setForm(prev => ({ ...prev, day, time: '', subject: '' }))
  }

  const handleTimeChange = (time: string) => {
    const session = getSession(form.day, time)
    setForm(prev => ({ 
      ...prev, 
      time, 
      subject: session?.subject || '' 
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm(prev => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let base64 = null
      if (form.file) {
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(form.file!)
        })
        base64 = await base64Promise
      }

      await createJustification({
        studentId: student.id,
        module: form.subject,
        fileName: form.file ? form.file.name : 'justificatif.pdf',
        fileContent: base64,
        absenceDate: form.date,
        absenceDay: form.day,
        absenceTime: form.time
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la soumission. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewSubmission = () => {
    setForm({
      date: '',
      day: '',
      time: '',
      subject: '',
      reason: '',
      file: null,
      description: '',
    })
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Demande envoyée</h2>
          <p className="text-muted-foreground mb-6">
            Votre justification d'absence a été soumise avec succès. 
            Vous recevrez une notification une fois traitée par l'administration.
          </p>
          <button
            onClick={handleNewSubmission}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Soumettre une nouvelle demande
          </button>
        </div>
      </motion.div>
    )
  }

  // History View
  if (view === 'history') {
    const pendingCount = history.filter(h => h.status === 'pending').length
    const approvedCount = history.filter(h => h.status === 'approved').length
    const rejectedCount = history.filter(h => h.status === 'rejected').length

    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Historique des justifications</h1>
          <p className="text-muted-foreground mt-1">
            Consultez vos demandes d'absence soumises
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
            <p className="text-sm text-muted-foreground">Approuvées</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
            <p className="text-sm text-muted-foreground">Refusées</p>
          </motion.div>
        </div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Cours</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Motif</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Document</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.date}</p>
                        <p className="text-xs text-muted-foreground">{item.day} {item.time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{SUBJECT_NAMES[item.subject] || item.subject}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{REASON_LABELS[item.reason] || item.reason}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Détails de la justification</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Date de l'absence</p>
                    <p className="text-sm font-medium text-foreground">{selectedItem.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horaire</p>
                    <p className="text-sm font-medium text-foreground">{selectedItem.day} {selectedItem.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cours</p>
                    <p className="text-sm font-medium text-foreground">{SUBJECT_NAMES[selectedItem.subject] || selectedItem.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Motif</p>
                    <p className="text-sm font-medium text-foreground">{REASON_LABELS[selectedItem.reason] || selectedItem.reason}</p>
                  </div>
                </div>
                
                {selectedItem.description && (
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm text-foreground">{selectedItem.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Document</p>
                  <div className="flex items-center gap-2 mt-1 p-2 bg-secondary rounded-lg">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{selectedItem.fileName}</span>
                    <button 
                      onClick={() => handleDownload(selectedItem)}
                      className="ml-auto p-1 hover:bg-primary/10 rounded transition-colors"
                    >
                      <FileDown className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedItem.status} />
                  </div>
                </div>

                {selectedItem.reviewComment && (
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Commentaire de l'administration</p>
                    <p className="text-sm text-foreground">{selectedItem.reviewComment}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Soumis le</p>
                    <p className="text-sm text-foreground">{new Date(selectedItem.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  {selectedItem.reviewedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Traité le</p>
                      <p className="text-sm text-foreground">{new Date(selectedItem.reviewedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </>
    )
  }

  // Form View
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Justifier une absence</h1>
          <p className="text-muted-foreground mt-1">
            Soumettez une justification pour une absence à un cours
          </p>
        </div>
        <button
          onClick={() => setView('history')}
          className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Eye size={16} />
          Voir l'historique
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Date de l'absence
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              {/* Day and Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Jour
                  </label>
                  <select
                    value={form.day}
                    onChange={(e) => handleDayChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  >
                    <option value="">Sélectionner un jour</option>
                    {DAYS.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Horaire
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    disabled={!form.day}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Sélectionner un horaire</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject (auto-filled) */}
              {form.subject && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <span className="font-medium">Cours concerné:</span>{' '}
                    {SUBJECT_NAMES[form.subject] || form.subject}
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Motif de l'absence
                </label>
                <select
                  value={form.reason}
                  onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Sélectionner un motif</option>
                  {REASON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <FileText className="w-4 h-4 inline-block mr-2" />
                  Justificatif (PDF, image)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {form.file ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-foreground">{form.file.name}</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Cliquez pour télécharger un fichier
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, JPG, PNG (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Informations supplémentaires
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ajoutez des détails supplémentaires si nécessaire..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Soumettre la justification
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Info Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Informations</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Délai de submission</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Les justifications doivent être soumises dans les 48 heures suivant l'absence.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Documents acceptés</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Certificat médical, convocation, ou tout document justifiant votre absence.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5 mt-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Demandes récentes</h3>
              <button
                onClick={() => setView('history')}
                className="text-xs text-primary hover:underline"
              >
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {history.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{SUBJECT_NAMES[item.subject] || item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.date} - {item.time}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}