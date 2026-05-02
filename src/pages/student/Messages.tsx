import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Send, Search, MoreVertical, Phone, Video,
  Paperclip, Image, Smile, Check, CheckCheck, Users,
  BookOpen, User, Circle, ArrowLeft
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import type { StudentUser } from '../../types/domain'
import { getMessages, sendMessage } from '../../lib/api'
import { useNavigate } from 'react-router-dom'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  type: 'teacher' | 'group'
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  messages: Message[]
}

interface Teacher {
  id: string
  name: string
  subject: string
  avatar?: string
}

// Mock teachers who teach this student
const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Pr. Karim Meziani', subject: 'Algorithmique' },
  { id: 't2', name: 'Dr. Sara Boudiaf', subject: 'Base de Données' },
  { id: 't3', name: 'Pr. Ahmed Benali', subject: 'Réseaux' },
  { id: 't4', name: 'Dr. Fatima Zohra', subject: 'Mathématiques' },
]

// Mock classmates for group chat
const CLASSMATES = [
  { id: 'c1', name: 'Ahmed Bouali' },
  { id: 'c2', name: 'Sara Mansouri' },
  { id: 'c3', name: 'Yacine Ferhat' },
  { id: 'c4', name: 'Nadia Cherif' },
  { id: 'c5', name: 'Omar Bensalem' },
  { id: 'c6', name: 'Lina Hadj' },
]

// Initial conversations
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 't1',
    type: 'teacher',
    name: 'Pr. Karim Meziani',
    lastMessage: 'N\'oubliez pas de soumettre le TD avant vendredi.',
    lastMessageTime: '10:30',
    unread: 2,
    messages: [
      { id: '1', senderId: 't1', content: 'Bonjour! Bienvenue dans mon cours d\'Algorithmique.', timestamp: '2025-01-15T09:00:00', status: 'read' },
      { id: '2', senderId: 'me', content: 'Bonjour Professor! Merci.', timestamp: '2025-01-15T09:05:00', status: 'read' },
      { id: '3', senderId: 't1', content: 'N\'oubliez pas de soumettre le TD avant vendredi.', timestamp: '2025-01-20T10:30:00', status: 'delivered' },
    ],
  },
  {
    id: 't2',
    type: 'teacher',
    name: 'Dr. Sara Boudiaf',
    lastMessage: 'La séance de TP est reportée à lundi prochain.',
    lastMessageTime: 'Hier',
    unread: 0,
    messages: [
      { id: '1', senderId: 't2', content: 'La séance de TP est reportée à lundi prochain.', timestamp: '2025-01-19T14:00:00', status: 'read' },
    ],
  },
  {
    id: 'group1',
    type: 'group',
    name: 'G2 - Classe L3',
    lastMessage: 'Quelqu\'un a compris l\'exercice 3?',
    lastMessageTime: '09:15',
    unread: 5,
    messages: [
      { id: '1', senderId: 'c1', content: 'Bonjour tout le monde!', timestamp: '2025-01-20T08:00:00', status: 'read' },
      { id: '2', senderId: 'c2', content: 'Bonjour Ahmed!', timestamp: '2025-01-20T08:05:00', status: 'read' },
      { id: '3', senderId: 'c3', content: 'Quelqu\'un a compris l\'exercice 3?', timestamp: '2025-01-20T09:15:00', status: 'read' },
    ],
  },
]

export default function StudentMessages() {
  const { user } = useAuth()
  const student = user as StudentUser
  const navigate = useNavigate()

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  useEffect(() => {
    if (selectedConversation) {
      getMessages(selectedConversation.id)
        .then(data => {
          if (data && Array.isArray(data)) {
            const mappedMessages = data.map((m: any) => ({
              id: String(m.id),
              senderId: m.sender.id === student.id ? 'me' : String(m.sender.id),
              content: m.content,
              timestamp: m.sentAt,
              status: 'delivered' as const,
            }))
            setSelectedConversation(prev => prev ? { ...prev, messages: mappedMessages } : null)
          }
        })
        .catch(console.error)
    }
  }, [selectedConversation?.id, student.id])

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const content = newMessage.trim()
    setNewMessage('')

    try {
      await sendMessage({ conversationId: selectedConversation.id, senderId: student.id, content })
      
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        content,
        timestamp: new Date().toISOString(),
        status: 'sent',
      }

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message.content,
            lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          }
        }
        return conv
      }))

      setSelectedConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message],
        lastMessage: message.content,
        lastMessageTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      } : null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    // Mark as read
    setConversations(prev => prev.map(c => 
      c.id === conv.id ? { ...c, unread: 0 } : c
    ))
  }

  const startNewChat = (teacher: Teacher) => {
    const existing = conversations.find(c => c.id === teacher.id)
    if (existing) {
      setSelectedConversation(existing)
    } else {
      const newConv: Conversation = {
        id: teacher.id,
        type: 'teacher',
        name: teacher.name,
        lastMessage: '',
        lastMessageTime: '',
        unread: 0,
        messages: [],
      }
      setConversations(prev => [newConv, ...prev])
      setSelectedConversation(newConv)
    }
    setShowNewChat(false)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const getAvatar = (conv: Conversation) => {
    if (conv.type === 'group') {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Users size={18} className="text-white" />
        </div>
      )
    }
    return (
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-white">
          {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Communiquez avec vos professeurs et camarades
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden h-[calc(100vh-220px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="border-r border-border flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-3 border-b border-border">
              <button
                onClick={() => setShowNewChat(true)}
                className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                + Nouveau message
              </button>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-3 flex items-start gap-3 hover:bg-secondary transition-colors text-left ${selectedConversation?.id === conv.id ? 'bg-secondary' : ''}`}
                >
                  {getAvatar(conv)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">{conv.name}</p>
                      <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAvatar(selectedConversation)}
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedConversation.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.type === 'group' 
                          ? `${CLASSMATES.length + 1} membres`
                          : TEACHERS.find(t => t.id === selectedConversation.id)?.subject
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate('/student/workspace')}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Ouvrir l'espace de travail"
                    >
                      <BookOpen size={18} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">Aucun message</p>
                      <p className="text-xs text-muted-foreground mt-1">Envoyez un message pour commencer la conversation</p>
                    </div>
                  ) : (
                    selectedConversation.messages.map((msg) => {
                      const isMe = msg.senderId === 'me'
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                            <div className={`px-4 py-2 rounded-2xl ${
                              isMe 
                                ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                : 'bg-secondary text-foreground rounded-bl-sm'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(msg.timestamp)}
                              </span>
                              {isMe && (
                                msg.status === 'read' ? (
                                  <CheckCheck size={14} className="text-primary" />
                                ) : (
                                  <Check size={14} className="text-muted-foreground" />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Paperclip size={20} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Image size={20} className="text-muted-foreground" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Smile size={20} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Sélectionnez une conversation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choisissez une conversation existante ou démarrez une nouvelle discussion
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Nouveau message</h3>
                <button
                  onClick={() => setShowNewChat(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-sm font-medium text-foreground mb-3">Professeurs</p>
                <div className="space-y-2">
                  {TEACHERS.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => startNewChat(teacher)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <BookOpen size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-sm font-medium text-foreground mb-3 mt-6">Groupes</p>
                <button
                  onClick={() => {
                    const existing = conversations.find(c => c.type === 'group')
                    if (existing) {
                      setSelectedConversation(existing)
                    }
                    setShowNewChat(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Users size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">G2 - Classe L3</p>
                    <p className="text-xs text-muted-foreground">{CLASSMATES.length + 1} membres</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}