import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Trash2, Eye } from 'lucide-react'
import { RESOURCES } from '../../data/users'

const TEACHER_RESOURCES = RESOURCES.filter((r) => r.teacher === 'Dr. Meziani')

export default function TeacherResources() {
  const [resources, setResources] = useState(TEACHER_RESOURCES)
  const [dragging, setDragging] = useState(false)

  const removeResource = (id: number) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
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
        className={`mb-6 p-8 border-2 border-dashed rounded-xl flex flex-col items-center gap-3 transition-all cursor-pointer ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
        }`}
      >
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Upload className="text-primary" size={24} />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Déposer un fichier ici</p>
          <p className="text-sm text-muted-foreground mt-0.5">ou cliquez pour parcourir — PDF, PPT, DOC (max 50MB)</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">
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
              </div>
              {r.isNew && (
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-500/15 text-blue-500 rounded-full flex-shrink-0">Nouveau</span>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary">
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => removeResource(r.id)}
                  className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
