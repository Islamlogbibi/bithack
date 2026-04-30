import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileCheck2 } from 'lucide-react'

export default function StudentJustification() {
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl bg-card border border-border rounded-xl p-6"
    >
      <h2 className="text-lg font-bold text-foreground">Déposer une justification</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Ajoutez une image ou un fichier PDF pour justifier une absence.
      </p>

      <div className="mt-5 space-y-4">
        <label className="flex items-center justify-center gap-2 px-4 py-10 border border-dashed border-border rounded-xl bg-secondary/40 cursor-pointer hover:bg-secondary transition-colors">
          <Upload size={18} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Choisir image / PDF</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {fileName && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            <FileCheck2 size={16} />
            {fileName}
          </div>
        )}

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
          Envoyer la justification
        </button>
      </div>
    </motion.div>
  )
}
