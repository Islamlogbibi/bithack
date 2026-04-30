import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, FileText, Presentation, File } from 'lucide-react'
import { RESOURCES } from '../../data/users'

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

  const filtered = RESOURCES.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
    const matchSubject = subject === 'Tous' || r.subject === subject
    const matchType = type === 'Tous' || r.type === type
    return matchSearch && matchSubject && matchType
  })

  return (
    <>
      {/* Filters */}
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

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">{filtered.length} ressource(s) trouvée(s)</p>

      {/* Resource grid */}
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
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(59,130,246,0.12)' }}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 cursor-default"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${fileInfo.color}`}>
                      {fileInfo.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {r.isNew && (
                        <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/15 text-blue-500 rounded-full">Nouveau</span>
                      )}
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{r.type}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground leading-snug">{r.title}</p>
                    <p className="text-xs text-primary mt-1">{r.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Par {r.teacher}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                      <p className="text-xs text-muted-foreground">{r.size}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      <Download size={13} />
                      Télécharger
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
