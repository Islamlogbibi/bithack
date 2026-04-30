import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/student/dashboard': 'Tableau de bord',
  '/student/schedule': 'Emploi du Temps',
  '/student/grades': 'Mes Notes',
  '/student/attendance': 'Mes Présences',
  '/student/resources': 'Ressources Pédagogiques',
  '/student/ai-assistant': 'Assistant IA',
  '/student/justification': 'Justification',
  '/teacher/dashboard': 'Tableau de bord',
  '/teacher/qr-attendance': 'Appel par QR Code',
  '/teacher/grades': 'Saisie des Notes',
  '/teacher/workload': 'Charge Horaire',
  '/teacher/resources': 'Ressources Partagées',
  '/admin/dashboard': 'Vue d\'ensemble',
  '/admin/validations': 'Validations en attente',
  '/admin/schedule': 'Emploi du Temps Global',
  '/admin/alerts': 'Alertes Absences',
  '/admin/professors': 'Professors',
  '/admin/students': 'Students',
  '/admin/specialities': 'Specialities',
  '/admin/justifications': 'Justifications',
}

export default function AppLayout() {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'PUI Smart Campus'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
