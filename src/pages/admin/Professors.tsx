import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, UserRound } from 'lucide-react'
import { PROFESSORS } from '../../data/users'

export default function AdminProfessors() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => PROFESSORS.filter((prof) => prof.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  return (
    <>
      <div className="mb-6 max-w-lg relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un enseignant..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((prof, i) => (
          <motion.div
            key={prof.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <UserRound size={18} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{prof.name}</p>
                <p className="text-sm text-muted-foreground">{prof.department}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-foreground"><span className="text-muted-foreground">Profil:</span> {prof.profile}</p>
              <p className="text-foreground"><span className="text-muted-foreground">CV:</span> {prof.cv}</p>
              <p className="text-muted-foreground">{prof.email} · {prof.phone}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}
