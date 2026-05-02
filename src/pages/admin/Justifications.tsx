import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, FileText, MessageSquare, X, XCircle, Download } from 'lucide-react'
import { getJustifications, reviewJustification } from '../../lib/api'
import { mockAdminJustifications } from '../../data/mockAdmin'
import { useEffect } from 'react'
type Status = 'all' | 'En attente' | 'Validée' | 'Rejetée'
type ReviewDecision = 'Validée' | 'Rejetée'

interface JustificationItem {
  id: string
  student: string
  matricule: string
  speciality: string
  module: string
  level: string
  section: string
  group: string
  file: string
  status: string
  reviewComment?: string
}

export default function AdminJustifications() {
  const [status, setStatus] = useState<Status>('all')
  const [items, setItems] = useState<JustificationItem[]>(mockAdminJustifications)
  const [selectedItem, setSelectedItem] = useState<JustificationItem | null>(null)
  const [decision, setDecision] = useState<ReviewDecision>('Validée')
  const [reviewComment, setReviewComment] = useState('')

  const handleDownload = (file: string) => {
    // Simulated download logic
    const pdfData = `%PDF-1.4\n1 0 obj\n<< /Title (${file}) /Creator (OSCA Hackathon) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n3 0 obj\n<< /Type /Pages /Count 1 /Kids [4 0 R] >>\nendobj\n4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (${file}) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000079 00000 n\n0000000128 00000 n\n0000000188 00000 n\n0000000282 00000 n\ntrailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n377\n%%EOF`
    const blob = new Blob([pdfData], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = file
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    getJustifications()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map backend entities to JustificationItem format
          const mapped = data.map(j => ({
            id: j.id.toString(),
            student: j.student.user.fullName,
            matricule: j.student.matricule,
            speciality: j.student.speciality,
            module: j.module,
            level: j.student.level,
            section: j.student.section,
            group: j.student.groupName,
            file: j.fileName,
            status: j.status === 'pending' ? 'En attente' : j.status === 'approved' ? 'Validée' : 'Rejetée',
            reviewComment: j.reviewComment
          }))
          setItems(mapped as JustificationItem[])
        }
      })
      .catch(console.error)
  }, [])

  const filtered = useMemo(
    () => items.filter((item) => status === 'all' || item.status === status),
    [items, status]
  )

  const openReviewModal = (item: JustificationItem) => {
    setSelectedItem(item)
    setDecision('Validée')
    setReviewComment(item.reviewComment ?? '')
  }

  const closeReviewModal = () => {
    setSelectedItem(null)
    setDecision('Validée')
    setReviewComment('')
  }

  const submitReview = async () => {
    if (!selectedItem) return
    try {
      await reviewJustification(parseInt(selectedItem.id), {
        status: decision === 'Validée' ? 'approved' : 'rejected',
        comment: reviewComment.trim()
      })
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                status: decision,
                reviewComment: reviewComment.trim(),
              }
            : item
        )
      )
    } catch (err) {
      console.error(err)
    }
    closeReviewModal()
  }

  return (
    <>
      <div className="mb-6 max-w-xs">
        <select aria-label="Filtrer les justifications par statut" value={status} onChange={(e) => setStatus(e.target.value as Status)} className="w-full px-3 py-2 bg-card border border-border rounded-xl text-sm">
          <option value="all">Toutes les justifications</option>
          <option value="En attente">En attente</option>
          <option value="Validée">Validées</option>
          <option value="Rejetée">Rejetées</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{item.student}</p>
                <p className="text-xs text-muted-foreground">
                  {item.matricule} · {item.speciality} · {item.module} · {item.level} · Section {item.section} · {item.group}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Fichier: {item.file}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${item.status === 'Validée' ? 'bg-emerald-500/15 text-emerald-500' : item.status === 'Rejetée' ? 'bg-red-500/15 text-red-500' : 'bg-amber-500/15 text-amber-500'}`}>
                  {item.status}
                </span>
                <button
                  onClick={() => openReviewModal(item)}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  Traiter
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Validation de justification</h2>
              <button
                onClick={closeReviewModal}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground">Etudiant</p>
                  <p className="text-sm font-medium text-foreground">{selectedItem.student}</p>
                  <p className="text-xs text-muted-foreground">{selectedItem.matricule}</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground">Cours</p>
                  <p className="text-sm font-medium text-foreground">{selectedItem.module}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedItem.level} - Section {selectedItem.section} - {selectedItem.group}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-secondary rounded-lg flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{selectedItem.file}</span>
                </div>
                <button 
                  onClick={() => handleDownload(selectedItem.file)}
                  className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Décision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDecision('Validée')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      decision === 'Validée'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                        : 'bg-secondary border-border text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Valider
                    </span>
                  </button>
                  <button
                    onClick={() => setDecision('Rejetée')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      decision === 'Rejetée'
                        ? 'bg-red-500/15 border-red-500/40 text-red-500'
                        : 'bg-secondary border-border text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      Rejeter
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MessageSquare className="w-4 h-4 inline-block mr-2" />
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ajouter un commentaire pour l'étudiant..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end gap-2">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitReview}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  decision === 'Validée'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Confirmer {decision === 'Validée' ? 'la validation' : 'le refus'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
