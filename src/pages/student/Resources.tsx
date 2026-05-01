import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, FileText, Presentation, File } from 'lucide-react'
import { apiGet } from '../../lib/api'
import { mapApiResource } from '../../lib/mappers'
import type { ResourceItem } from '../../types/domain'

const FILE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  PDF: { icon: <FileText size={24} />, color: 'text-red-500 bg-red-500/10' },
  PPT: { icon: <Presentation size={24} />, color: 'text-orange-500 bg-orange-500/10' },
  DOC: { icon: <File size={24} />, color: 'text-blue-500 bg-blue-500/10' },
}

const SUBJECTS = ['Tous', 'Algorithmique', 'Réseaux', 'Base de Données', 'Mathématiques', 'Anglais Technique']
const TYPES = ['Tous', 'Cours', 'TD', 'TP', 'Exam']

export default function StudentResources() {
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('Tous')
  const [type, setType] = useState('Tous')
  const [resources, setResources] = useState<ResourceItem[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await apiGet<Parameters<typeof mapApiResource>[0][]>('/resources')
        if (cancelled) return
        setResources(raw.map(mapApiResource))
      } catch {
        setResources([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
    const matchSubject = subject === 'Tous' || r.subject === subject
    const matchType = type === 'Tous' || r.type === type
    return matchSearch && matchSubject && matchType
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une ressource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} ressource(s) trouvée(s)</p>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
              <FileText size={28} className="text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold">Aucune ressource trouvée</p>
            <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos filtres</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((r, i) => {
              const fileInfo = FILE_ICONS[r.fileType] || FILE_ICONS.PDF
              return (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`p-2.5 rounded-xl ${fileInfo.color}`}>
                      {fileInfo.icon}
                    </div>
                    {r.isNew && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-600 rounded-full">NOUVEAU</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{r.subject} · {r.type}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{r.teacher}</span>
                    <span>{r.size}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-secondary hover:bg-primary/10 text-foreground rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Download size={14} />
                    Télécharger
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
