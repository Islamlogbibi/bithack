import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Zap, CheckCircle, Users } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
const TOTAL_STUDENTS = 28
const COURSES = ['Algorithmique', 'Structures de Données', 'Analyse Numérique', 'Probabilités']
const GROUPS = ['G1', 'G2', 'G3']
const SESSION_TYPES = ['Cours', 'TD', 'TP']

const FAKE_STUDENTS = [
  { name: 'Ahmed Bouali', mat: '202012301' },
  { name: 'Sara Mansouri', mat: '202012302' },
  { name: 'Yacine Ferhat', mat: '202012303' },
  { name: 'Nadia Cherif', mat: '202012304' },
  { name: 'Omar Bensalem', mat: '202012305' },
  { name: 'Lina Hadj', mat: '202012306' },
  { name: 'Bilal Saoudi', mat: '202012307' },
  { name: 'Amira Touati', mat: '202012308' },
  { name: 'Karim Zerrouki', mat: '202012309' },
  { name: 'Fatima Benali', mat: '202012310' },
]

interface ScannedStudent {
  name: string
  mat: string
  time: string
}

export default function QRAttendance() {
  const [course, setCourse] = useState(COURSES[0])
  const [group, setGroup] = useState(GROUPS[0])
  const [sessionType, setSessionType] = useState(SESSION_TYPES[0])
  const [qrGenerated, setQrGenerated] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 min
  const [scanned, setScanned] = useState<ScannedStudent[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const qrValue = `PUI|${course}|${group}|${sessionType}|${Date.now()}`

  useEffect(() => {
    if (qrGenerated && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else if (timeLeft === 0) {
      setQrGenerated(false)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [qrGenerated, timeLeft])

  const handleGenerate = () => {
    setScanned([])
    setTimeLeft(900)
    setQrGenerated(true)
  }

  const handleClose = () => {
    setQrGenerated(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const simulateScan = () => {
    const remaining = FAKE_STUDENTS.filter((s) => !scanned.find((sc) => sc.mat === s.mat))
    if (remaining.length === 0) return
    const pick = remaining[Math.floor(Math.random() * remaining.length)]
    setScanned((prev) => [
      ...prev,
      { ...pick, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
    ])
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerPct = (timeLeft / 900) * 100
  const r = 48
  const circ = 2 * Math.PI * r

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Setup */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Configuration de la session</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">1. Module</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  disabled={qrGenerated}
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                >
                  {COURSES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">2. Groupe</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  disabled={qrGenerated}
                  className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                >
                  {GROUPS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">3. Type de séance</label>
                <div className="flex gap-2">
                  {SESSION_TYPES.map((t) => (
                    <button
                      key={t}
                      disabled={qrGenerated}
                      onClick={() => setSessionType(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 ${sessionType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-muted'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={qrGenerated}
              className="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <QrCode size={18} />
              Générer QR Code
            </motion.button>
          </motion.div>

          {/* QR Display */}
          <AnimatePresence>
            {qrGenerated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border-2 border-blue-500/50 rounded-xl p-5 flex flex-col items-center gap-4"
              >
                {/* Status badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 rounded-full">
                  <motion.span
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Zap size={12} className="inline mr-1" />
                    Session Active
                  </span>
                </div>

                {/* QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG value={qrValue} size={180} />
                </div>

                {/* Timer ring */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r={r} fill="none" stroke="currentColor" className="text-border" strokeWidth="8" />
                    <motion.circle
                      cx="55" cy="55" r={r} fill="none"
                      stroke={timeLeft < 120 ? '#EF4444' : '#3B82F6'} strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ - (timerPct / 100) * circ}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className={`text-xl font-bold font-mono ${timeLeft < 120 ? 'text-red-500' : 'text-primary'}`}>
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <p className="text-xs text-muted-foreground">restant</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{course} · {group} · {sessionType}</p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-2 bg-red-500/15 text-red-500 border border-red-500/30 rounded-xl text-sm font-semibold hover:bg-red-500/25 transition-colors"
                >
                  Fermer la session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Live feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users size={18} className="text-primary" />
              Présences en temps réel
            </h3>
            <span className="text-sm font-bold text-primary">{scanned.length} / {TOTAL_STUDENTS} étudiants</span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                animate={{ width: `${(scanned.length / TOTAL_STUDENTS) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Simulate button */}
          {qrGenerated && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={simulateScan}
              className="mb-4 w-full py-2 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 rounded-xl text-sm font-semibold hover:bg-indigo-500/25 transition-colors"
            >
              Simuler un scan
            </motion.button>
          )}

          {/* Student list */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {scanned.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-3"
                  >
                    <QrCode size={24} className="text-muted-foreground" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">En attente de scans...</p>
                  <p className="text-xs text-muted-foreground mt-1">Générez un QR code puis cliquez sur &quot;Simuler un scan&quot;</p>
                </div>
              ) : (
                scanned.map((s, i) => (
                  <motion.div
                    key={s.mat}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-xl"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.mat}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{s.time}</p>
                      <CheckCircle size={16} className="text-emerald-500 ml-auto" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
    </div>
  )
}
