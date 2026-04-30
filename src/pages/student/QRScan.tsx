import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, QrCode, CheckCircle, XCircle, Clock, MapPin, BookOpen, AlertCircle, History } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { StudentUser } from '../../data/users'

interface ScanResult {
  course: string
  group: string
  sessionType: string
  timestamp: number
}

interface AttendanceRecord {
  id: string
  course: string
  group: string
  sessionType: string
  scannedAt: string
  status: 'success' | 'error'
  message: string
}

const COURSES = ['Algorithmique', 'Structures de Données', 'Analyse Numérique', 'Probabilités']
const SUBJECT_KEYS: Record<string, string> = {
  'Algorithmique': 'algo',
  'Structures de Données': 'db',
  'Analyse Numérique': 'math',
  'Probabilités': 'networks',
}

export default function StudentQRScan() {
  const { user } = useAuth()
  const student = user as StudentUser

  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Mock previous attendance
  const mockHistory: AttendanceRecord[] = [
    {
      id: '1',
      course: 'Algorithmique',
      group: 'G1',
      sessionType: 'Cours',
      scannedAt: '2025-01-20T09:15:00',
      status: 'success',
      message: 'Présence enregistrée',
    },
    {
      id: '2',
      course: 'Structures de Données',
      group: 'G1',
      sessionType: 'TD',
      scannedAt: '2025-01-18T14:30:00',
      status: 'success',
      message: 'Présence enregistrée',
    },
    {
      id: '3',
      course: 'Analyse Numérique',
      group: 'G2',
      sessionType: 'TP',
      scannedAt: '2025-01-15T11:00:00',
      status: 'error',
      message: 'Session QR expirée',
    },
  ]

  const startCamera = async () => {
    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setScanning(true)
    } catch (err) {
      setCameraError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.')
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  // Simulate QR code scanning (in real app, use a QR library like html5-qrcode)
  const simulateScan = () => {
    // Simulate finding a valid QR code
    const mockQRValue = `PUI|${COURSES[0]}|G1|Cours|${Date.now()}`
    processQRCode(mockQRValue)
  }

  const processQRCode = (value: string) => {
    // Parse QR code: PUI|course|group|sessionType|timestamp
    const parts = value.split('|')
    
    if (parts.length !== 5 || parts[0] !== 'PUI') {
      const errorRecord: AttendanceRecord = {
        id: Date.now().toString(),
        course: 'Inconnu',
        group: '-',
        sessionType: '-',
        scannedAt: new Date().toISOString(),
        status: 'error',
        message: 'Code QR invalide',
      }
      setAttendanceHistory(prev => [errorRecord, ...prev])
      return
    }

    const [, course, group, sessionType, timestamp] = parts
    const qrAge = Date.now() - parseInt(timestamp)
    const maxAge = 15 * 60 * 1000 // 15 minutes

    if (qrAge > maxAge) {
      const errorRecord: AttendanceRecord = {
        id: Date.now().toString(),
        course,
        group,
        sessionType,
        scannedAt: new Date().toISOString(),
        status: 'error',
        message: 'Session QR expirée',
      }
      setAttendanceHistory(prev => [errorRecord, ...prev])
      return
    }

    // Success!
    const result: ScanResult = { course, group, sessionType, timestamp: parseInt(timestamp) }
    setLastScan(result)

    const successRecord: AttendanceRecord = {
      id: Date.now().toString(),
      course,
      group,
      sessionType,
      scannedAt: new Date().toISOString(),
      status: 'success',
      message: 'Présence enregistrée',
    }
    setAttendanceHistory(prev => [successRecord, ...prev])
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Scanner QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Scannez le code QR affiché par votre professeur pour marquer votre présence
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Area */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Camera View */}
            <div className="relative aspect-[4/3] bg-black">
              {scanning ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-primary/50 rounded-2xl relative">
                      <motion.div
                        className="absolute inset-0 border-4 border-primary rounded-2xl"
                        animate={{ 
                          borderColor: ['#3B82F6', '#10B981', '#3B82F6']
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      {/* Corner markers */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                    </div>
                  </div>

                  {/* Scanning line animation */}
                  <motion.div
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ top: ['20%', '80%', '20%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary">
                  <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Caméra inactive</p>
                </div>
              )}

              {/* Camera controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3">
                {scanning ? (
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <XCircle size={18} />
                    Arrêter
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Camera size={18} />
                    Activer la caméra
                  </button>
                )}
              </div>
            </div>

            {/* Error message */}
            {cameraError && (
              <div className="p-4 bg-red-500/10 border-t border-red-500/30">
                <p className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {cameraError}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-2">Comment scanner</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Cliquez sur "Activer la caméra" pour ouvrir le scanner</li>
                <li>2. Pointez votre téléphone vers le code QR du professeur</li>
                <li>3. Le scan est automatique - attendez la confirmation</li>
              </ol>
              
              {/* Demo button for testing */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Mode démo (pour tester sans caméra):</p>
                <button
                  onClick={simulateScan}
                  disabled={!scanning}
                  className="w-full py-2 bg-secondary border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simuler un scan QR
                </button>
              </div>
            </div>
          </motion.div>

          {/* Last Scan Result */}
          <AnimatePresence>
            {lastScan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 bg-card border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Présence confirmée!</p>
                    <p className="text-sm text-muted-foreground">
                      {lastScan.course} · {lastScan.group} · {lastScan.sessionType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Heure du scan</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div>
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <h3 className="font-semibold text-foreground mb-4">Aujourd'hui</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sessions présentes</span>
                <span className="text-sm font-bold text-green-500">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sessions manquées</span>
                <span className="text-sm font-bold text-red-500">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de présence</span>
                <span className="text-sm font-bold text-primary">100%</span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-5 mt-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Activité récente</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <History size={14} />
                Voir tout
              </button>
            </div>
            <div className="space-y-3">
              {(attendanceHistory.length > 0 ? attendanceHistory : mockHistory).slice(0, 3).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                >
                  {record.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{record.course}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.sessionType} · {record.group}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${record.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {record.status === 'success' ? 'OK' : 'Erreur'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Important</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous devez scanner le QR code dans les 15 minutes suivant sa génération pour que votre présence soit valide.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Historique des présences</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {(attendanceHistory.length > 0 ? attendanceHistory : mockHistory).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 p-4 border-b border-border last:border-0"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.status === 'success' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                      {record.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{record.course}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.sessionType} · {record.group}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.scannedAt).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.scannedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}