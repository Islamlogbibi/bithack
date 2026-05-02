import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Participant {
  id: number;
  name: string;
  initials: string;
  color: string;
  online: boolean;
  role: "teacher" | "student";
}

interface WorkspaceLink {
  id: number;
  title: string;
  platform: "google-drive" | "github" | "notion" | "figma" | "slack";
  url: string;
  sharedBy: string;
  sharedAt: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  workspaceId?: number;
}

interface Course {
  id: number;
  name: string;
  code: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  color: string;
  icon: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  { id: 1, name: "AI & Machine Learning", code: "CS-501", unread: 3, lastMessage: "Workspace link shared!", lastTime: "2m", color: "#6366f1", icon: "🤖" },
  { id: 2, name: "Embedded Systems", code: "EE-301", unread: 0, lastMessage: "Lab 4 deadline extended", lastTime: "1h", color: "#f59e0b", icon: "⚙️" },
  { id: 3, name: "Data Structures", code: "CS-201", unread: 1, lastMessage: "Check the GitHub repo", lastTime: "3h", color: "#10b981", icon: "🌲" },
  { id: 4, name: "Computer Networks", code: "CS-401", unread: 0, lastMessage: "Quiz postponed to Friday", lastTime: "1d", color: "#ef4444", icon: "🌐" },
  { id: 5, name: "Linear Algebra", code: "MATH-201", unread: 0, lastMessage: "Problem set 3 uploaded", lastTime: "2d", color: "#8b5cf6", icon: "📐" },
];

const PARTICIPANTS: Participant[] = [
  { id: 1, name: "Dr. Layla Hassan", initials: "LH", color: "#6366f1", online: true, role: "teacher" },
  { id: 2, name: "Karim Benali", initials: "KB", color: "#f59e0b", online: true, role: "student" },
  { id: 3, name: "Sara Messaoudi", initials: "SM", color: "#10b981", online: false, role: "student" },
  { id: 4, name: "Youcef Amrani", initials: "YA", color: "#ef4444", online: true, role: "student" },
  { id: 5, name: "Nour Bensalem", initials: "NB", color: "#ec4899", online: false, role: "student" },
];

const ME = PARTICIPANTS[1]; // Karim is "me"

const WORKSPACES: WorkspaceLink[] = [
  { id: 1, title: "AI Project Workspace", platform: "google-drive", url: "https://drive.google.com/drive/folders/ai-project-2024", sharedBy: "Dr. Layla Hassan", sharedAt: "10:14 AM" },
  { id: 2, title: "Model Training Codebase", platform: "github", url: "https://github.com/cs501/ai-project-2024", sharedBy: "Dr. Layla Hassan", sharedAt: "10:15 AM" },
  { id: 3, title: "Project Planning Board", platform: "notion", url: "https://notion.so/cs501/ai-project-board", sharedBy: "Dr. Layla Hassan", sharedAt: "10:16 AM" },
];

const INITIAL_MESSAGES: Message[] = [
  { id: 1, senderId: 1, text: "Good morning everyone! 🎓 I've set up our collaborative workspace for the AI project. Please find all the links below — make sure you request access before Friday.", timestamp: "10:12 AM" },
  { id: 2, senderId: 1, text: "Here are the workspace resources:", timestamp: "10:14 AM", workspaceId: 1 },
  { id: 3, senderId: 1, text: "And the code repository:", timestamp: "10:15 AM", workspaceId: 2 },
  { id: 4, senderId: 1, text: "Planning board for sprint tracking:", timestamp: "10:16 AM", workspaceId: 3 },
  { id: 5, senderId: 3, text: "Thank you Dr. Hassan! I've already requested access to Drive 🙌", timestamp: "10:19 AM" },
  { id: 6, senderId: 4, text: "GitHub repo is great, forked it! Any branch naming conventions we should follow?", timestamp: "10:22 AM" },
  { id: 7, senderId: 1, text: "Yes — please use `feature/your-name-feature-description`. I'll review PRs every Thursday.", timestamp: "10:24 AM" },
  { id: 8, senderId: 2, text: "Perfect, thanks! Will push the data preprocessing module by Wednesday 💪", timestamp: "10:27 AM" },
];

// ─── Platform Config ──────────────────────────────────────────────────────────
const PLATFORM_CONFIG: Record<string, { label: string; icon: string; gradient: string; bg: string }> = {
  "google-drive": { label: "Google Drive", icon: "▲", gradient: "from-blue-500 to-green-400", bg: "bg-blue-50 border-blue-200" },
  github: { label: "GitHub", icon: "⬡", gradient: "from-slate-700 to-slate-900", bg: "bg-slate-50 border-slate-200" },
  notion: { label: "Notion", icon: "◻", gradient: "from-slate-900 to-slate-700", bg: "bg-gray-50 border-gray-200" },
  figma: { label: "Figma", icon: "✦", gradient: "from-purple-500 to-pink-500", bg: "bg-purple-50 border-purple-200" },
  slack: { label: "Slack", icon: "◈", gradient: "from-green-500 to-teal-500", bg: "bg-green-50 border-green-200" },
};

const shorten = (url: string) => url.replace("https://", "").slice(0, 38) + (url.length > 48 ? "…" : "");

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ participant, size = "md", showStatus = false }: { participant: Participant; size?: "sm" | "md" | "lg"; showStatus?: boolean }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shadow-sm`} style={{ backgroundColor: participant.color }}>
        {participant.initials}
      </div>
      {showStatus && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${participant.online ? "bg-emerald-400" : "bg-slate-300"}`} />
      )}
    </div>
  );
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold shadow-2xl animate-toast">
      <span className="text-emerald-400">✓</span> {message}
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: WorkspaceLink }) {
  const [copied, setCopied] = useState(false);
  const cfg = PLATFORM_CONFIG[workspace.platform];

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(workspace.url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [workspace.url]);

  return (
    <div className={`mt-2 rounded-2xl border ${cfg.bg} overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
      <div className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Platform badge */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-lg font-black shadow-sm flex-shrink-0`}>
          {cfg.icon}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{workspace.title}</p>
          <p className="text-xs text-slate-400 truncate font-mono mt-0.5">{shorten(workspace.url)}</p>
        </div>
        {/* Actions */}
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => window.open(workspace.url, "_blank")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
          >
            Open ↗
          </button>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${copied ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600"}`}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className={`h-0.5 w-full bg-gradient-to-r ${cfg.gradient} opacity-30 group-hover:opacity-70 transition-opacity`} />
    </div>
  );
}

function MessageBubble({ message, sender, isMe }: { message: Message; sender: Participant; isMe: boolean }) {
  const workspace = message.workspaceId ? WORKSPACES.find((w) => w.id === message.workspaceId) : null;

  return (
    <div className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} mb-4`}>
      {!isMe && <Avatar participant={sender} size="sm" showStatus />}
      <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && <span className="text-xs font-semibold text-slate-500 ml-1">{sender.name}</span>}
        <div
          className={`px-3 md:px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isMe
              ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-br-sm"
              : sender.role === "teacher"
              ? "bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-md"
              : "bg-slate-100 text-slate-800 rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
        {workspace && (
          <div className="w-full">
            <WorkspaceCard workspace={workspace} />
          </div>
        )}
        <span className="text-[10px] text-slate-400 mx-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

function TypingIndicator({ participant }: { participant: Participant }) {
  return (
    <div className="flex items-end gap-2.5 mb-4">
      <Avatar participant={participant} size="sm" showStatus />
      <div className="flex flex-col gap-1 items-start">
        <span className="text-xs font-semibold text-slate-500 ml-1">{participant.name}</span>
        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-slate-100 shadow-md flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ courses, selectedId, onSelect, isOpen, onToggle }: { courses: Course[]; selectedId: number; onSelect: (id: number) => void; isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-80 flex-shrink-0 h-full flex flex-col bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Sidebar header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg shadow-md">
                🎓
              </div>
              <div>
                <h1 className="font-black text-slate-800 text-sm tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>UniConnect</h1>
                <p className="text-xs text-slate-400">Course Messaging</p>
              </div>
            </div>
            <button onClick={onToggle} className="md:hidden text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses…"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            />
            <span className="absolute left-2.5 top-2.5 text-slate-300 text-sm">🔍</span>
          </div>
        </div>

        {/* Course list */}
        <div className="flex-1 overflow-y-auto py-2 custom-scroll">
          {courses.map((course) => {
            const active = course.id === selectedId;
            return (
              <button
                key={course.id}
                onClick={() => onSelect(course.id)}
                className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all duration-150 hover:bg-slate-50 relative ${active ? "bg-indigo-50 border-r-2 border-indigo-500" : ""}`}
              >
                {/* Course icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: course.color + "18", border: `1px solid ${course.color}30` }}
                >
                  {course.icon}
                </div>
                {/* Course info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold truncate ${active ? "text-indigo-700" : "text-slate-700"}`}>{course.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2 flex-shrink-0">{course.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-slate-400 truncate">{course.lastMessage}</span>
                    {course.unread > 0 && (
                      <span className="ml-2 min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: course.color }}>
                        {course.unread}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 mt-0.5 block">{course.code}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom user info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar participant={ME} size="md" showStatus />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{ME.name}</p>
              <p className="text-xs text-emerald-500 font-medium">● Online</p>
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors text-lg">⚙</button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Main Chat Panel ──────────────────────────────────────────────────────────
function ChatPanel({ course, participants, messages, onSend, onToggleSidebar }: {
  course: Course;
  participants: Participant[];
  messages: Message[];
  onSend: (text: string) => void;
  onToggleSidebar: () => void;
}) {
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Simulate teacher typing occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2500);
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  const handleOpenWorkspace = () => {
    setWorkspaceOpen((p) => !p);
  };

  const teacher = participants.find((p) => p.role === "teacher")!;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 bg-white border-b border-slate-100 flex items-center gap-4 shadow-sm">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm" style={{ backgroundColor: course.color + "18", border: `1px solid ${course.color}30` }}>
          {course.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-slate-800" style={{ fontFamily: "'Sora', sans-serif" }}>{course.name}</h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-lg">{course.code}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {participants.slice(0, 4).map((p) => (
              <Avatar key={p.id} participant={p} size="sm" showStatus />
            ))}
            {participants.length > 4 && (
              <span className="text-xs text-slate-400 ml-1">+{participants.length - 4} more</span>
            )}
            <span className="text-xs text-slate-400 ml-2">
              {participants.filter((p) => p.online).length} online
            </span>
          </div>
        </div>

        {/* Open Workspace button */}
        <button
          onClick={handleOpenWorkspace}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-violet-700 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span>🔗</span> Open Workspace
        </button>
      </div>

      {/* Workspace panel (expandable) */}
      {workspaceOpen && (
        <div className="flex-shrink-0 px-4 md:px-6 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 animate-expand">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-indigo-800 flex items-center gap-2">
              <span>🔗</span> Workspace Resources
              <span className="text-xs font-normal text-indigo-400">({WORKSPACES.length} links)</span>
            </h3>
            <button onClick={() => setWorkspaceOpen(false)} className="text-indigo-300 hover:text-indigo-600 text-lg transition-colors">✕</button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {WORKSPACES.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 custom-scroll" style={{ background: "linear-gradient(to bottom, #f8fafc, #f1f5f9)" }}>
        {messages.map((msg) => {
          const sender = participants.find((p) => p.id === msg.senderId) ?? participants[0];
          const isMe = msg.senderId === ME.id;
          return <MessageBubble key={msg.id} message={msg} sender={sender} isMe={isMe} />;
        })}
        {typing && <TypingIndicator participant={teacher} />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 md:px-4 py-2.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Avatar participant={ME} size="sm" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button className="text-slate-300 hover:text-slate-500 transition-colors text-lg hidden sm:block">📎</button>
            <button className="text-slate-300 hover:text-slate-500 transition-colors text-lg hidden sm:block">😊</button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-300 mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function WorkspacePage() {
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId)!;

  const handleSend = useCallback((text: string) => {
    const newMsg: Message = {
      id: Date.now(),
      senderId: ME.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
  }, []);

  const handleSelectCourse = useCallback((id: number) => {
    setSelectedCourseId(id);
    setSidebarOpen(false); // Close sidebar on mobile when selecting course
    if (id === 1) {
      setMessages(INITIAL_MESSAGES);
    } else {
      setMessages([
        {
          id: 1,
          senderId: 1,
          text: `Welcome to the ${COURSES.find((c) => c.id === id)?.name} channel! 👋`,
          timestamp: "09:00 AM",
        },
      ]);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'Sora', system-ui, sans-serif; }
        .font-mono, code { font-family: 'DM Mono', monospace; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        @keyframes toast-in { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-toast { animation: toast-in 0.2s ease; }
        @keyframes expand-down { from { max-height: 0; opacity: 0; } to { max-height: 600px; opacity: 1; } }
        .animate-expand { animation: expand-down 0.3s ease; overflow: hidden; }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
        .animate-bounce { animation: bounce 1.2s infinite; }
      `}</style>

      <div className="flex min-h-screen w-full bg-slate-50 overflow-hidden">
        <Sidebar 
          courses={COURSES} 
          selectedId={selectedCourseId} 
          onSelect={handleSelectCourse}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        <ChatPanel
          course={selectedCourse}
          participants={PARTICIPANTS}
          messages={messages}
          onSend={handleSend}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </>
  );
}
