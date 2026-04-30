import { useState } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../shared/ThemeToggle'

interface TopbarProps {
  title: string
}

const NOTIFICATIONS = [
  { id: 1, text: '4 absences détectées en Algorithmique', time: 'il y a 2h', dot: 'bg-amber-500' },
  { id: 2, text: 'Nouvelle ressource publiée par Dr. Meziani', time: 'il y a 5h', dot: 'bg-blue-500' },
  { id: 3, text: 'Note de Base de Données soumise', time: 'il y a 1j', dot: 'bg-purple-500' },
]

export default function Topbar({ title }: TopbarProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="h-[64px] flex items-center justify-between px-6 border-b border-border bg-card z-10 flex-shrink-0">
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 p-2"
              >
                <p className="text-xs font-semibold text-muted-foreground px-3 py-1.5">Notifications ({NOTIFICATIONS.length})</p>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-sm text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ThemeToggle />
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user?.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground hidden md:block">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
