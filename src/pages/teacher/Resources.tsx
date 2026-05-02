import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Trash2, Eye, X, Check, Users, BookOpen, Clock } from 'lucide-react'
import { apiGet, apiDelete, apiPost } from '../../lib/api'
import { mapApiResource } from '../../lib/mappers'
import type { ResourceItem } from '../../types/domain'
import { useAuth } from '../../context/AuthContext'
import type { TeacherUser } from '../../types/domain'
import { hoursDiff } from '../../lib/sla'
import type { SlaResourceStatus } from '../../lib/sla'
import SlaBadge from '../../components/shared/SlaBadge'
import type { SlaBadgeStatus } from '../../components/shared/SlaBadge'

const SUBJECTS = ['Algorithmique', 'Structures de Données', 'Analyse Numérique', 'Probabilités']

interface SpecialityTreeNode {
  speciality: string
  levels: {
    level: string
    sections: {
      section: string
      groups: { group: string }[]
    }[]
  }[]
}

interface ResourceForm {
  title: string
  subject: string
  type: string
  speciality: string
  level: string
  section: string
  group: string
  file: File | null
}

/** Compute SLA 48h status for a resource. */
function getResourceSla(r: ResourceItem): { status: SlaResourceStatus; badgeStatus: SlaBadgeStatus; label: string; remaining: number } {
  if (r.publishedAt) return { status: 'published', badgeStatus: 'ok', label: 'Publié', remaining: 0 }
  const elapsed = hoursDiff(new Date(r.createdAt), new Date())
  if (elapsed > 48) return { status: 'late', badgeStatus: 'late', label: 'En retard', remaining: 0 }
  return { status: 'pending', badgeStatus: 'pending', label: 'En attente', remaining: Math.max(0, 48 - elapsed) }
}

export default function TeacherResources() {
  const { user } = useAuth()
  const teacher = user as TeacherUser | null
  const teacherName = teacher?.name ?? ''
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [specialityTree, setSpecialityTree] = useState<SpecialityTreeNode[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleDownload = (resource: ResourceItem) => {
    // If we have real content, use it. Otherwise fallback to simulation.
    let blob: Blob
    
    if (resource.fileContent) {
      // Decode base64
      const byteCharacters = atob(resource.fileContent.split(',')[1] || resource.fileContent)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      blob = new Blob([byteArray], { type: resource.fileType === 'PDF' ? 'application/pdf' : 'application/octet-stream' })
    } else {
      const isPdf = resource.fileType.toLowerCase() === 'pdf'
      if (isPdf) {
        const pdfData = `%PDF-1.4\n1 0 obj\n<< /Title (${resource.title}) /Creator (OSCA Hackathon) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n3 0 obj\n<< /Type /Pages /Count 1 /Kids [4 0 R] >>\nendobj\n4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT /F1 24 Tf 100 700 Td (${resource.title}) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000079 00000 n\n0000000128 00000 n\n0000000188 00000 n\n0000000282 00000 n\ntrailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n377\n%%EOF`
        blob = new Blob([pdfData], { type: 'application/pdf' })
      } else {
        const content = `Simulation of resource: ${resource.title}\nSubject: ${resource.subject}\nTeacher: ${resource.teacher}`
        blob = new Blob([content], { type: 'text/plain' })
      }
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resource.title.replace(/\s+/g, '_')}.${resource.fileType.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await apiGet<Parameters<typeof mapApiResource>[0][]>('/resources')
        if (cancelled) return
        const mapped = raw.map(mapApiResource).filter((r) => !teacherName || r.teacher === teacherName)
        setResources(mapped)
      } catch {
        setResources([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [teacherName])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const tree = await apiGet<SpecialityTreeNode[]>('/specialities/tree')
        if (!cancelled) setSpecialityTree(Array.isArray(tree) ? tree : [])
      } catch {
        if (!cancelled) setSpecialityTree([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])
  const [dragging, setDragging] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [form, setForm] = useState<ResourceForm>({
    title: '',
    subject: '',
    type: 'Cours',
    speciality: '',
    level: '',
    section: '',
    group: '',
    file: null,
  })

  const removeResource = async (id: number) => {
    try {
      await apiDelete(`/resources/${id}`)
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch {
      /* ignore */
    }
  }

  const selectedSpeciality = specialityTree.find((s) => s.speciality === form.speciality)
  const levelOptions = selectedSpeciality?.levels ?? []
  const selectedLevel = levelOptions.find((l) => l.level === form.level)
  const sectionOptions = selectedLevel?.sections ?? []
  const selectedSection = sectionOptions.find((s) => s.section === form.section)
  const groupOptions = selectedSection?.groups ?? []

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.speciality || !form.level || !form.section || !form.group || !form.file) return
    setIsSubmitting(true)
    
    try {
      // Convert file to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(form.file!)
      })
      const base64 = await base64Promise

      await apiPost('/resources', {
        title: form.title,
        subject: form.subject,
        type: form.type,
        fileType: form.file.name.split('.').pop()?.toUpperCase() ?? 'PDF',
        teacherName,
        sizeLabel: `${(form.file.size / 1024 / 1024).toFixed(1)} MB`,
        isNew: true,
        fileContent: base64,
        groupsJson: [form.group],
        specialityName: form.speciality,
        levelName: form.level,
        sectionName: form.section,
        groupName: form.group,
      })
      
      setShowUploadModal(false)
      setForm({ title: '', subject: '', type: 'Cours', speciality: '', level: '', section: '', group: '', file: null })
      
      // Refresh list
      const raw = await apiGet<Parameters<typeof mapApiResource>[0][]>('/resources')
      setResources(raw.map(mapApiResource).filter(r => !teacherName || r.teacher === teacherName))
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
        onClick={() => setShowUploadModal(true)}
        className={`mb-6 p-8 border-2 border-dashed rounded-xl flex flex-col items-center gap-3 transition-all cursor-pointer ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
        }`}
      >
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Upload className="text-primary" size={24} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Publier une ressource</p>
          <p className="text-sm text-muted-foreground mt-0.5">Cliquez pour sélectionner un fichier et une cible pédagogique</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowUploadModal(true) }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
        >
          Parcourir les fichiers
        </button>
      </motion.div>

      {/* SLA 48h overview banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-wrap items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl"
      >
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground">SLA Publication</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">48h max</span>
        {/* {(() => {
          const late = resources.filter(r => getResourceSla(r).status === 'late').length
          const pending = resources.filter(r => getResourceSla(r).status === 'pending').length
          const published = resources.filter(r => getResourceSla(r).status === 'published').length
          return (
            <div className="flex items-center gap-3 ml-auto text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" />{published} publiés</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500" />{pending} en attente</span>
              {late > 0 && <span className="flex items-center gap-1 text-red-600 dark:text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{late} en retard</span>}
            </div>
          )
        })()} */}
      </motion.div>

      {/* Resources list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-semibold text-foreground">Mes documents publiés ({resources.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {resources.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/40 transition-colors"
            >
              <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  {/* SLA 48h badge per resource */}
                  {/* {(() => {
                    const sla = getResourceSla(r)
                    return (
                      <SlaBadge
                        slaLabel="48h"
                        status={sla.badgeStatus}
                        statusText={sla.label}
                        
                        tooltip="Les ressources doivent être publiées dans les 48 heures suivant leur création"
                      />
                    )
                  })()} */}
                </div>
                <p className="text-xs text-muted-foreground">{r.subject} · {r.type} · {r.size} · {r.date}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users size={12} className="text-muted-foreground" />
                  <span className="text-xs text-primary">
                    {r.groupName ? `${r.specialityName || ''} ${r.levelName || ''} ${r.sectionName || ''} ${r.groupName}`.trim() : 'Tous'}
                  </span>
                </div>
              </div>
              {r.isNew && (
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/15 text-blue-500 rounded-full flex-shrink-0">Nouveau</span>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button 
                  onClick={() => handleDownload(r)}
                  className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => void removeResource(r.id)}
                  className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Publier une ressource</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fichier
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="teacher-resource-upload"
                      accept=".pdf,.ppt,.pptx,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        setForm(prev => ({ ...prev, file }))
                      }}
                    />
                    <label htmlFor="teacher-resource-upload" className="cursor-pointer">
                      {form.file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm text-foreground font-medium">{form.file.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Cliquez pour télécharger un fichier
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, PPT, DOC (max 50MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Titre du document
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Cours Chapitre 1 - Algorithmique"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <BookOpen className="w-4 h-4 inline-block mr-2" />
                    Matière
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Sélectionner une matière</option>
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type de document
                  </label>
                  <div className="flex gap-2">
                    {['Cours', 'TD', 'TP', 'Examen'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setForm(prev => ({ ...prev, type }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                          form.type === type 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hierarchy target */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Spécialité</label>
                    <select
                      value={form.speciality}
                      onChange={(e) => setForm(prev => ({ ...prev, speciality: e.target.value, level: '', section: '', group: '' }))}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Sélectionner</option>
                      {specialityTree.map((s) => <option key={s.speciality} value={s.speciality}>{s.speciality}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Niveau</label>
                    <select
                      value={form.level}
                      onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value, section: '', group: '' }))}
                      disabled={!form.speciality}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Sélectionner</option>
                      {levelOptions.map((l) => <option key={l.level} value={l.level}>{l.level}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Section</label>
                    <select
                      value={form.section}
                      onChange={(e) => setForm(prev => ({ ...prev, section: e.target.value, group: '' }))}
                      disabled={!form.level}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Sélectionner</option>
                      {sectionOptions.map((s) => <option key={s.section} value={s.section}>{s.section}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      <Users className="w-4 h-4 inline-block mr-2" />
                      Groupe
                    </label>
                    <select
                      value={form.group}
                      onChange={(e) => setForm(prev => ({ ...prev, group: e.target.value }))}
                      disabled={!form.section}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Sélectionner</option>
                      {groupOptions.map((g) => <option key={g.group} value={g.group}>{g.group}</option>)}
                    </select>
                  </div>
                </div>
                {!form.group && (
                  <p className="text-xs text-red-500 mt-1">Veuillez sélectionner spécialité, niveau, section et groupe</p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !form.title || !form.subject || !form.speciality || !form.level || !form.section || !form.group || !form.file}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {isSubmitting ? 'Publication en cours...' : 'Publier la ressource'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
