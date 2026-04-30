import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, BookOpen, Users, FileText,
  Bot, QrCode, ClipboardList, Clock, LogOut, ChevronLeft,
  ChevronRight, GraduationCap, ShieldCheck, BarChart2, AlertTriangle,
  UserRound, Network, FileCheck2, ScanLine, MessageSquare, FileUp, Building2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: string
}

const studentNav: NavItem[] = [
  { label: 'Tableau de bord', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Emploi du Temps', path: '/student/schedule', icon: <Calendar size={20} /> },
  { label: 'Mes Notes', path: '/student/grades', icon: <BookOpen size={20} /> },
  { label: 'Présences', path: '/student/attendance', icon: <Users size={20} /> },
  { label: 'Scanner QR', path: '/student/qr-scan', icon: <ScanLine size={20} /> },
  { label: 'Justifier Absence', path: '/student/absence-justification', icon: <FileCheck2 size={20} /> },
  { label: 'Messages', path: '/student/messages', icon: <MessageSquare size={20} /> },
  { label: 'Ressources', path: '/student/resources', icon: <FileText size={20} /> },
  { label: 'Assistant IA', path: '/student/ai-assistant', icon: <Bot size={20} />, badge: 'IA' },

  { label: 'Justification', path: '/student/justification', icon: <FileCheck2 size={20} /> },

]

const teacherNav: NavItem[] = [
  { label: 'Tableau de bord', path: '/teacher/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Présences QR', path: '/teacher/qr-attendance', icon: <QrCode size={20} /> },
  { label: 'Saisie Notes', path: '/teacher/grades', icon: <ClipboardList size={20} /> },
  { label: 'Ressources', path: '/teacher/resources', icon: <FileText size={20} /> },
  { label: 'Charge Horaire', path: '/teacher/workload', icon: <Clock size={20} /> },
]

const adminNav: NavItem[] = [
  { label: 'Vue d\'ensemble', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Validations', path: '/admin/validations', icon: <ShieldCheck size={20} />, badge: '7' },
  { label: 'Emploi du Temps', path: '/admin/schedule', icon: <Calendar size={20} /> },
  { label: 'Alertes Absences', path: '/admin/alerts', icon: <AlertTriangle size={20} /> },
  { label: 'Professors', path: '/admin/professors', icon: <UserRound size={20} /> },
  { label: 'Students', path: '/admin/students', icon: <Users size={20} /> },
  { label: 'Specialities', path: '/admin/specialities', icon: <Network size={20} /> },
  { label: 'Justifications', path: '/admin/justifications', icon: <FileUp size={20} /> },
]

const deanNav: NavItem[] = [
  { label: 'Tableau de bord', path: '/dean/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Emploi du Temps', path: '/dean/schedule', icon: <Calendar size={20} /> },
  { label: 'Justifications', path: '/dean/justifications', icon: <FileUp size={20} /> },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const nav = user?.role === 'student' ? studentNav
    : user?.role === 'teacher' ? teacherNav
      : user?.role === 'dean' ? deanNav
        : adminNav

  const roleLabel = user?.role === 'student' ? t('role.student', 'Etudiant')
    : user?.role === 'teacher' ? t('role.teacher', 'Enseignant')
      : user?.role === 'dean' ? t('role.dean', 'Doyen')
        : t('role.admin', 'Administration')

  const RoleIcon = user?.role === 'student' ? GraduationCap
    : user?.role === 'teacher' ? BarChart2
      : user?.role === 'dean' ? Building2
        : ShieldCheck

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden z-10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border min-h-[68px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white font-bold text-sm">PUI</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-bold text-sidebar-foreground leading-none">PUI Smart Campus</p>
              <p className="text-xs text-muted-foreground mt-0.5">Univ. Badji Mokhtar</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-sidebar-foreground hover:bg-secondary hover:text-primary'
              }`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="text-sm font-medium truncate flex-1"
                >
                  {item.path.endsWith('/dashboard')
                    ? t('sidebar.dashboard', item.label)
                    : item.path.endsWith('/schedule')
                      ? t('sidebar.schedule', item.label)
                      : item.path.endsWith('/justifications')
                        ? t('sidebar.justifications', item.label)
                        : item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!collapsed && item.badge && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${item.badge === 'IA' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-red-500 text-white'}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-4 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <RoleIcon size={14} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                {t('common.logout', 'Deconnexion')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
