import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, BarChart2, Calendar, BookOpen, AlertTriangle } from 'lucide-react'
import { mockStudent } from '../../data/mockStudent'
import type { StudentUser } from '../../types/domain'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: React.ReactNode
  timestamp: string
}

function getTime() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function AbsenceCard({ student }: { student: StudentUser }) {
  const algo = student.absences.algo ?? 0
  const risk = algo >= 5 ? 'ÉLEVÉ' : algo >= 3 ? 'MODÉRÉ' : 'FAIBLE'
  const riskColor = algo >= 5 ? 'text-red-500 bg-red-500/15' : algo >= 3 ? 'text-amber-500 bg-amber-500/15' : 'text-emerald-500 bg-emerald-500/15'
  return (
    <div className="bg-secondary rounded-xl p-4 border-l-4 border-amber-500 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-foreground">Algorithmique</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${riskColor}`}>Risque {risk}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(algo / 5) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground font-mono">{algo}/5</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {algo >= 5
          ? "Attention! Vous avez atteint le seuil d'exclusion."
          : `Il vous reste ${5 - algo} absence(s) avant le seuil d'exclusion. Soyez prudent.`}
      </p>
    </div>
  )
}

function GradeCard({ student }: { student: StudentUser }) {
  return (
    <div className="bg-secondary rounded-xl p-4 space-y-2">
      <p className="text-sm font-bold text-foreground">Votre moyenne générale: <span className="text-primary">{student.gpa}/20</span></p>
      {student.grades.map((g, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-32 truncate">{g.subject}</span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full"
              style={{
                width: `${((g.final ?? 0) / 20) * 100}%`,
                background: (g.final ?? 0) >= 14 ? '#10B981' : (g.final ?? 0) >= 10 ? '#F59E0B' : '#EF4444'
              }}
            />
          </div>
          <span className="text-xs font-bold text-foreground w-8 text-right">{g.final ?? '—'}</span>
        </div>
      ))}
    </div>
  )
}

function ScheduleCard({ student }: { student: StudentUser }) {
  const next = student.schedule[0]
  return (
    <div className="bg-secondary rounded-xl p-4 flex items-center gap-4 border-l-4 border-blue-500">
      <div className="w-12 h-12 bg-blue-500/15 rounded-xl flex items-center justify-center">
        <Calendar className="text-blue-500" size={22} />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{next.subject}</p>
        <p className="text-xs text-muted-foreground">{next.day} à {next.time}</p>
        <p className="text-xs text-primary font-medium">{next.room} · {next.type}</p>
      </div>
    </div>
  )
}

function buildResponse(q: string, student: StudentUser): React.ReactNode {
  const lower = q.toLowerCase()
  if (lower.includes('exclusion') || lower.includes('absence') || lower.includes('algo')) {
    return <AbsenceCard student={student} />
  }
  if (lower.includes('moyenne') || lower.includes('note') || lower.includes('gpa')) {
    return <GradeCard student={student} />
  }
  if (lower.includes('cours') || lower.includes('planning') || lower.includes('prochain')) {
    return <ScheduleCard student={student} />
  }
  if (lower.includes('ressource') || lower.includes('document') || lower.includes('pdf')) {
    return (
      <div className="bg-secondary rounded-xl p-4 space-y-2">
        <p className="text-sm font-bold text-foreground">Ressources récentes disponibles:</p>
        {['Cours Algorithmique Ch.3 (PDF)', 'TD Algorithmique N°5 (PDF)', 'Cours Réseaux TCP/IP (PPT)'].map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen size={13} className="text-primary flex-shrink-0" />
            {r}
          </div>
        ))}
        <p className="text-xs text-muted-foreground">Accédez à la section Ressources pour les télécharger.</p>
      </div>
    )
  }
  return (
    <p className="text-sm text-foreground">
      Je peux vous aider avec vos absences, notes, emploi du temps et ressources. Posez une question plus spécifique ou utilisez les suggestions ci-dessous.
    </p>
  )
}

const QUICK_SUGGESTIONS = [
  { label: 'Mes absences', icon: <AlertTriangle size={14} /> },
  { label: 'Ma moyenne', icon: <BarChart2 size={14} /> },
  { label: 'Mon planning', icon: <Calendar size={14} /> },
  { label: 'Mes ressources', icon: <BookOpen size={14} /> },
]

export default function AIAssistant() {
  const student = mockStudent
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: 'user',
      content: 'Est-ce que je risque l\'exclusion en Algorithmique ?',
      timestamp: '09:00',
    },
    {
      id: 2, role: 'assistant',
      content: <AbsenceCard student={student} />,
      timestamp: '09:00',
    },
    {
      id: 3, role: 'user',
      content: 'Quelle est ma moyenne générale ?',
      timestamp: '09:01',
    },
    {
      id: 4, role: 'assistant',
      content: <GradeCard student={student} />,
      timestamp: '09:01',
    },
    {
      id: 5, role: 'user',
      content: 'Quand est mon prochain cours ?',
      timestamp: '09:02',
    },
    {
      id: 6, role: 'assistant',
      content: <ScheduleCard student={student} />,
      timestamp: '09:02',
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now(), role: 'user', content: text, timestamp: getTime() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)
    await new Promise((r) => setTimeout(r, 1200))
    setTyping(false)
    const reply: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: buildResponse(text, student),
      timestamp: getTime(),
    }
    setMessages((prev) => [...prev, reply])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-card border border-border rounded-xl overflow-hidden">
        {/* AI Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Bot className="text-white" size={22} />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/50"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
          </div>
          <div>
            <p className="font-bold text-foreground">Assistant PUI</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Conseiller Académique IA</span>
              <span className="text-xs text-emerald-500 font-semibold">· En ligne</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-primary' : 'bg-gradient-to-br from-blue-500 to-indigo-500'}`}>
                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-primary/10 border border-primary/20 text-foreground'
                    : 'bg-secondary border-l-2 border-primary text-foreground'
                }`}>
                  {typeof msg.content === 'string'
                    ? <p className="text-sm">{msg.content}</p>
                    : msg.content}
                </div>
                <span className="text-xs text-muted-foreground px-1">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-secondary border-l-2 border-primary rounded-2xl px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-border">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-full text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex-shrink-0"
            >
              <span className="text-primary">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
            className="flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question académique..."
              className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!input.trim() || typing}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 transition-opacity"
            >
              <Send size={18} />
            </motion.button>
          </form>
        </div>
      </div>
  )
}
