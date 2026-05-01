import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, GraduationCap, BookOpen, Building2, Landmark } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import ThemeToggle from '../components/shared/ThemeToggle'
import FloatingOrbs from '../components/shared/FloatingOrbs'

type RoleTab = 'student' | 'teacher' | 'admin' | 'dean'
const MAIN_LOGO_SRC = '/university-logo.png'

const CREDENTIALS: Record<RoleTab, { email: string; password: string; label: string }> = {
  student: { email: 'student@pui.dz', password: 'student123', label: 'Mabrouk Benali — Étudiant L3' },
  teacher: { email: 'teacher@pui.dz', password: 'teacher123', label: 'Dr. Karim Meziani — Enseignant' },
  admin: { email: 'admin@pui.dz', password: 'admin123', label: 'Prof. Amina Hadj — Administration' },
  dean: { email: 'dean@pui.dz', password: 'dean123', label: 'Pr. Samia Belkacem — Doyen' },
}

export default function Login() {
  const { user, login } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<RoleTab>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    const map: Record<string, string> = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      admin: '/admin/dashboard',
      dean: '/dean/dashboard',
    }
    const target = map[user.role]
    if (target) navigate(target, { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (!ok) {
      setError('Email ou mot de passe incorrect.')
    }
  }

  const fillCredentials = (role: RoleTab) => {
    setActiveTab(role)
    setEmail(CREDENTIALS[role].email)
    setPassword(CREDENTIALS[role].password)
    setError('')
  }

  const tabs: { role: RoleTab; icon: React.ReactNode; label: string }[] = [
    { role: 'student', icon: <GraduationCap size={16} />, label: 'Étudiant' },
    { role: 'teacher', icon: <BookOpen size={16} />, label: 'Enseignant' },
    { role: 'admin', icon: <Building2 size={16} />, label: 'Administration' },
    { role: 'dean', icon: <Landmark size={16} />, label: 'Doyen' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background p-4">
      <FloatingOrbs />

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <select
          aria-label={t('common.language', 'Langue')}
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'fr' | 'en' | 'ar')}
          className="px-2 py-1.5 text-xs bg-secondary border border-border rounded-lg text-foreground"
        >
          <option value="fr">{t('language.fr', 'Francais')}</option>
          <option value="en">{t('language.en', 'English')}</option>
          <option value="ar">{t('language.ar', 'العربية')}</option>
        </select>
        <ThemeToggle />
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/90 border border-border flex items-center justify-center shadow-xl mb-3 p-2">
              <img src={MAIN_LOGO_SRC} alt="Universite Badji Mokhtar Annaba" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-balance text-center">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                PUI Smart Campus
              </span>
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-1">Plateforme Universitaire Intégrée</p>
          </div>

          {/* Role tabs */}
          <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.role}
                onClick={() => setActiveTab(tab.role)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab.role
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:block">
                  {tab.role === 'student'
                    ? t('role.student', tab.label)
                    : tab.role === 'teacher'
                      ? t('role.teacher', tab.label)
                      : tab.role === 'admin'
                        ? t('role.admin', tab.label)
                        : t('role.dean', tab.label)}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('login.universityEmail', 'Email universitaire')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votreemail@pui.dz"
                required
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="relative">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('login.password', 'Mot de passe')}</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70 relative overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('login.connecting', 'Connexion...')}
                </span>
              ) : t('login.login', 'Se connecter')}
            </motion.button>
          </form>

          {/* Quick login hints */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-medium text-muted-foreground text-center">Connexion rapide (démonstration)</p>
            {(Object.entries(CREDENTIALS) as [RoleTab, typeof CREDENTIALS[RoleTab]][]).map(([role, cred]) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => fillCredentials(role)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-secondary border border-border rounded-lg hover:border-primary/50 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-semibold text-foreground">{cred.label}</p>
                  <p className="text-xs text-muted-foreground">{cred.email}</p>
                </div>
                <span className="text-xs text-primary font-medium">Remplir</span>
              </motion.button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Université Badji Mokhtar — Annaba &copy; 2025
        </p>
      </motion.div>
    </div>
  )
}
