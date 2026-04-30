import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, FileText, Upload, Send, AlertCircle, FileDown, Eye, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StudentUser } from '../../data/users'

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
}

const MOCK_HISTORY: JustificationHistory[] = [
  {
    id: '1',
    date: '2025-01-15',
    day: 'Mercredi',
    time: '08:00',
    subject: 'algo',
    reason: 'medical',
    description: 'Grippe saisonnière',
    fileName: 'certificat_medical.pdf',
    status: 'approved',
    submittedAt: '2025-01-15T10:30:00',
    reviewedAt: '2025-01-16T09:00:00',
    reviewComment: 'Justification acceptée',
  },
  {
    id: '2',
    date: '2025-01-20',
    day: 'Lundi',
    time: '14:00',
    subject: 'networks',
    reason: 'transport',
    description: 'Problème de transport en commun',
    fileName: 'attestation_stc.pdf',
    status: 'pending',
    submittedAt: '2025-01-20T15:00:00',
  },
  {
    id: '3',
    date: '2025-01-10',
    day: 'Vendredi',
    time: '09:45',
    subject: 'db',
    reason: 'family',
    description: 'Déménagement familial urgent',
    fileName: 'demande_famille.pdf',
    status: 'rejected',
    submittedAt: '2025-01-10T08:00:00',
    reviewedAt: '2025-01-11T14:00:00',
    reviewComment: 'Document insuffisant - merci de fournir un certificat officiel',
  },
  {
    id: '4',
    date: '2025-01-08',
    day: 'Mercredi',
    time: '11:30',
    subject: 'web',
    reason: 'medical',
    description: 'Rendez-vous médical',
    fileName: 'rdv_medical.pdf',
    status: 'approved',
    submittedAt: '2025-01-08T07:30:00',
    reviewedAt: '2025-01-08T16:00:00',
  },
]

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
  const { user } = useAuth()
  const student = user as StudentUser

  const [view, setView] = useState<'form' | 'history'>('form')
  const [selectedItem, setSelectedItem] = useState<JustificationHistory | null>(null)

  const [form, setForm] = useState<JustificationForm>({
    date: '',
    day: '',
    time: '',
    subject: '',
    reason: '',
    file: null,
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
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
    const pendingCount = MOCK_HISTORY.filter(h => h.status === 'pending').length
    const approvedCount = MOCK_HISTORY.filter(h => h.status === 'approved').length
    const rejectedCount = MOCK_HISTORY.filter(h => h.status === 'rejected').length

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
                {MOCK_HISTORY.map((item) => (
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
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <FileDown className="w-4 h-4 text-muted-foreground" />
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
                    <button className="ml-auto p-1 hover:bg-primary/10 rounded transition-colors">
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
              {MOCK_HISTORY.slice(0, 2).map((item) => (
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