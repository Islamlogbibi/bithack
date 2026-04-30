export type Role = 'student' | 'teacher' | 'admin'

export interface Grade {
  subject: string
  td: number
  exam: number | null
  final: number | null
  status: 'Validé' | 'En attente' | 'Rejeté'
  credits: number
}

export interface ScheduleItem {
  day: string
  time: string
  subject: string
  room: string
  type: 'Cours' | 'TD' | 'TP'
}

export interface PendingGrade {
  student: string
  matricule: string
  group: string
  td: number
  exam: number | null
  status: string
}

export interface StudentUser {
  id: number
  name: string
  email: string
  password: string
  role: 'student'
  matricule: string
  group: string
  year: string
  gpa: number
  absences: Record<string, number>
  grades: Grade[]
  schedule: ScheduleItem[]
}

export interface TeacherUser {
  id: number
  name: string
  email: string
  password: string
  role: 'teacher'
  department: string
  subjects: string[]
  groups: string[]
  hoursPlanned: number
  hoursCompleted: number
  pendingGrades: PendingGrade[]
}

export interface AdminUser {
  id: number
  name: string
  email: string
  password: string
  role: 'admin'
  department: string
  stats: {
    totalStudents: number
    activeTeachers: number
    pendingValidations: number
    avgAttendance: number
    publishedResources: number
  }
}

export type AppUser = StudentUser | TeacherUser | AdminUser

export const TEST_USERS: AppUser[] = [
  {
    id: 1,
    name: 'Mabrouk Benali',
    email: 'student@pui.dz',
    password: 'student123',
    role: 'student',
    matricule: '202012345',
    group: 'G2',
    year: 'L3 Informatique',
    gpa: 14.7,
    absences: { algo: 4, networks: 1, db: 2 },
    grades: [
      { subject: 'Algorithmique', td: 13, exam: 15, final: 14.2, status: 'Validé', credits: 6 },
      { subject: 'Réseaux', td: 16, exam: 14, final: 14.8, status: 'Validé', credits: 4 },
      { subject: 'Base de Données', td: 12, exam: 11, final: 11.4, status: 'En attente', credits: 5 },
      { subject: 'Mathématiques', td: 17, exam: 16, final: 16.4, status: 'Validé', credits: 4 },
      { subject: 'Anglais Technique', td: 15, exam: 14, final: 14.6, status: 'Validé', credits: 2 },
    ],
    schedule: [
      { day: 'Dimanche', time: '08:00', subject: 'Algorithmique', room: 'Salle A12', type: 'Cours' },
      { day: 'Dimanche', time: '10:00', subject: 'Réseaux', room: 'Labo R3', type: 'TP' },
      { day: 'Lundi', time: '08:00', subject: 'Base de Données', room: 'Salle B04', type: 'TD' },
      { day: 'Lundi', time: '14:00', subject: 'Mathématiques', room: 'Salle A08', type: 'Cours' },
      { day: 'Mardi', time: '10:00', subject: 'Algorithmique', room: 'Labo Info', type: 'TP' },
      { day: 'Mercredi', time: '08:00', subject: 'Anglais Technique', room: 'Salle C02', type: 'TD' },
    ],
  },
  {
    id: 2,
    name: 'Dr. Karim Meziani',
    email: 'teacher@pui.dz',
    password: 'teacher123',
    role: 'teacher',
    department: 'Informatique',
    subjects: ['Algorithmique', 'Structures de Données'],
    groups: ['G1', 'G2', 'G3'],
    hoursPlanned: 96,
    hoursCompleted: 72,
    pendingGrades: [
      { student: 'Ahmed Bouali', matricule: '202012301', group: 'G1', td: 14, exam: null, status: 'En attente' },
      { student: 'Sara Mansouri', matricule: '202012302', group: 'G1', td: 16, exam: null, status: 'En attente' },
      { student: 'Yacine Ferhat', matricule: '202012303', group: 'G2', td: 11, exam: null, status: 'En attente' },
      { student: 'Nadia Cherif', matricule: '202012304', group: 'G2', td: 15, exam: null, status: 'En attente' },
      { student: 'Omar Bensalem', matricule: '202012305', group: 'G3', td: 9, exam: null, status: 'En attente' },
    ],
  },
  {
    id: 3,
    name: 'Prof. Amina Hadj',
    email: 'admin@pui.dz',
    password: 'admin123',
    role: 'admin',
    department: 'Département Informatique',
    stats: {
      totalStudents: 342,
      activeTeachers: 28,
      pendingValidations: 7,
      avgAttendance: 87,
      publishedResources: 156,
    },
  },
]

export const RESOURCES = [
  { id: 1, title: 'Cours Algorithmique — Chapitre 3', subject: 'Algorithmique', type: 'Cours', fileType: 'PDF', size: '2.4 MB', date: '2025-01-10', teacher: 'Dr. Meziani', isNew: true },
  { id: 2, title: 'TD Algorithmique N°5 — Arbres', subject: 'Algorithmique', type: 'TD', fileType: 'PDF', size: '1.1 MB', date: '2025-01-08', teacher: 'Dr. Meziani', isNew: true },
  { id: 3, title: 'Cours Réseaux — Protocoles TCP/IP', subject: 'Réseaux', type: 'Cours', fileType: 'PPT', size: '5.6 MB', date: '2025-01-06', teacher: 'Dr. Boualem', isNew: false },
  { id: 4, title: 'TP Réseaux — Configuration Router', subject: 'Réseaux', type: 'TP', fileType: 'PDF', size: '0.8 MB', date: '2025-01-05', teacher: 'Dr. Boualem', isNew: false },
  { id: 5, title: 'Cours Base de Données — SQL Avancé', subject: 'Base de Données', type: 'Cours', fileType: 'PDF', size: '3.2 MB', date: '2025-01-03', teacher: 'Mme. Rahmani', isNew: false },
  { id: 6, title: 'Examen BDD 2024 — Corrigé', subject: 'Base de Données', type: 'Exam', fileType: 'PDF', size: '0.6 MB', date: '2024-12-20', teacher: 'Mme. Rahmani', isNew: false },
  { id: 7, title: 'Cours Mathématiques — Analyse', subject: 'Mathématiques', type: 'Cours', fileType: 'PDF', size: '4.1 MB', date: '2024-12-18', teacher: 'Dr. Laadj', isNew: false },
  { id: 8, title: 'TD Anglais Technique N°3', subject: 'Anglais Technique', type: 'TD', fileType: 'DOC', size: '0.4 MB', date: '2024-12-15', teacher: 'Mme. Ferhat', isNew: false },
]

export const ADMIN_PENDING_VALIDATIONS = [
  { id: 1, teacher: 'Dr. Karim Meziani', module: 'Algorithmique', group: 'G1', count: 28, submitted: '2025-01-10T09:30:00', slaHours: 18 },
  { id: 2, teacher: 'Dr. Karim Meziani', module: 'Algorithmique', group: 'G2', count: 30, submitted: '2025-01-10T10:15:00', slaHours: 16 },
  { id: 3, teacher: 'Mme. Rahmani', module: 'Base de Données', group: 'G1', count: 27, submitted: '2025-01-09T14:00:00', slaHours: 6 },
  { id: 4, teacher: 'Dr. Boualem', module: 'Réseaux', group: 'G3', count: 25, submitted: '2025-01-09T16:30:00', slaHours: 8 },
  { id: 5, teacher: 'Dr. Laadj', module: 'Mathématiques', group: 'G2', count: 29, submitted: '2025-01-08T11:00:00', slaHours: 2 },
  { id: 6, teacher: 'Mme. Ferhat', module: 'Anglais Technique', group: 'G1', count: 26, submitted: '2025-01-08T15:00:00', slaHours: 4 },
  { id: 7, teacher: 'Dr. Messaoud', module: 'Structures de Données', group: 'G3', count: 28, submitted: '2025-01-07T09:00:00', slaHours: 0 },
]

export const ABSENCE_ALERTS = [
  { student: 'Khalil Bouzid', matricule: '202012201', subject: 'Algorithmique', absences: 5, max: 6, risk: 'high' },
  { student: 'Rania Slimani', matricule: '202012202', subject: 'Base de Données', absences: 5, max: 6, risk: 'high' },
  { student: 'Fares Taleb', matricule: '202012203', subject: 'Réseaux', absences: 4, max: 6, risk: 'medium' },
  { student: 'Mabrouk Benali', matricule: '202012345', subject: 'Algorithmique', absences: 4, max: 6, risk: 'medium' },
  { student: 'Houda Amrani', matricule: '202012204', subject: 'Mathématiques', absences: 3, max: 6, risk: 'low' },
]

export const WORKLOAD_DATA = [
  { teacher: 'Dr. Meziani', planned: 96, completed: 72 },
  { teacher: 'Dr. Boualem', planned: 84, completed: 84 },
  { teacher: 'Mme. Rahmani', planned: 72, completed: 60 },
  { teacher: 'Dr. Laadj', planned: 96, completed: 88 },
  { teacher: 'Mme. Ferhat', planned: 60, completed: 52 },
  { teacher: 'Dr. Messaoud', planned: 84, completed: 70 },
]
