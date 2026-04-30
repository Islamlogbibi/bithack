import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { STUDENTS_DIRECTORY } from '../../data/users'

export default function AdminStudents() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => STUDENTS_DIRECTORY.filter((student) =>
      `${student.name} ${student.matricule}`.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  )

  return (
    <>
      <div className="mb-6 max-w-lg relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un étudiant..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.matricule} · {student.level} · Section {student.section} · {student.group}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <p><span className="text-muted-foreground">Moyenne:</span> <span className="font-semibold text-primary">{student.average.toFixed(1)}</span></p>
                <p><span className="text-muted-foreground">Absences:</span> <span className="font-semibold">{student.absences}</span></p>
                <p><span className="text-muted-foreground">Notes:</span> <span className="font-semibold">{student.notes.map((n) => n.toFixed(1)).join(' / ')}</span></p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}
