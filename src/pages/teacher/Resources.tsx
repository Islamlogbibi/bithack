import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Trash2, Eye, X, Check, Users, BookOpen } from 'lucide-react'
import { apiGet, apiDelete } from '../../lib/api'
import { mapApiResource } from '../../lib/mappers'
import type { ResourceItem } from '../../types/domain'

const SUBJECTS = ['Algorithmique', 'Structures de Données', 'Analyse Numérique', 'Probabilités']
const GROUPS = ['G1', 'G2', 'G3']
const ALL_GROUPS = ['L3 Info G1', 'L3 Info G2', 'L3 Info G3', 'L3 SI G1', 'L3 SI G2']

interface ResourceForm {
  title: string
  subject: string
  type: string
  groups: string[]
  file: File | null
}

export default function TeacherResources() {
  const [resources, setResources] = useState<ResourceItem[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await apiGet<Parameters<typeof mapApiResource>[0][]>('/resources')
        if (cancelled) return
        const mapped = raw.map(mapApiResource).filter((r) => r.teacher.includes('Meziani'))
        setResources(mapped)
      } catch {
        setResources([])
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
    groups: [],
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

  const toggleGroup = (group: string) => {
    setForm(prev => ({
      ...prev,
      groups: prev.groups.includes(group)
        ? prev.groups.filter(g => g !== group)
        : [...prev.groups, group]
    }))
  }

  const handleSubmit = () => {
    if (!form.title || !form.subject || form.groups.length === 0) return
    // In real app, would upload file here
    setShowUploadModal(false)
    setForm({ title: '', subject: '', type: 'Cours', groups: [], file: null })
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
          <p className="text-sm text-muted-foreground mt-0.5">Cliquez pour sélectionner un fichier et des groupes cibles</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowUploadModal(true) }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
        >
          Parcourir les fichiers
        </button>
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
                <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.subject} · {r.type} · {r.size} · {r.date}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users size={12} className="text-muted-foreground" />
                  <span className="text-xs text-primary">G1, G2</span>
                </div>
              </div>
              {r.isNew && (
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/15 text-blue-500 rounded-full flex-shrink-0">Nouveau</span>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary">
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
                    />
                    <label htmlFor="teacher-resource-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour télécharger un fichier
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, PPT, DOC (max 50MB)
                      </p>
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

                {/* Groups Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Users className="w-4 h-4 inline-block mr-2" />
                    Groupes cibles <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_GROUPS.map((group) => (
                      <button
                        key={group}
                        onClick={() => toggleGroup(group)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                          form.groups.includes(group)
                            ? 'bg-primary/15 border-primary/50 text-primary'
                            : 'bg-secondary border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {form.groups.includes(group) && (
                          <Check size={14} className="text-primary" />
                        )}
                        <span className="text-sm">{group}</span>
                      </button>
                    ))}
                  </div>
                  {form.groups.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      Veuillez sélectionner au moins un groupe
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!form.title || !form.subject || form.groups.length === 0}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publier la ressource
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
