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

export interface ValidationStudentGrade {
  student: string
  matricule: string
  grade: number
}

export interface AdminPendingValidation {
  id: number
  teacher: string
  speciality: string
  module: string
  level: string
  section: string
  group: string
  count: number
  submitted: string
  slaHours: number
  studentGrades: ValidationStudentGrade[]
}

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

export const ADMIN_PENDING_VALIDATIONS: AdminPendingValidation[] = [
  {
    id: 1,
    teacher: 'Dr. Karim Meziani',
    speciality: 'Informatique',
    module: 'Algorithmique',
    level: 'L2',
    section: 'A',
    group: 'G1',
    count: 28,
    submitted: '2025-01-10T09:30:00',
    slaHours: 18,
    studentGrades: [
      { student: 'Ahmed Bouali', matricule: '202012301', grade: 15.5 },
      { student: 'Sara Mansouri', matricule: '202012302', grade: 14.8 },
      { student: 'Nadia Cherif', matricule: '202012304', grade: 13.4 },
    ],
  },
  {
    id: 2,
    teacher: 'Dr. Karim Meziani',
    speciality: 'Informatique',
    module: 'Algorithmique',
    level: 'L3',
    section: 'A',
    group: 'G2',
    count: 30,
    submitted: '2025-01-10T10:15:00',
    slaHours: 16,
    studentGrades: [
      { student: 'Mabrouk Benali', matricule: '202012345', grade: 14.2 },
      { student: 'Lina Sadoud', matricule: '202012322', grade: 16.1 },
      { student: 'Farid Bousselah', matricule: '202012325', grade: 11.7 },
    ],
  },
  {
    id: 3,
    teacher: 'Mme. Rahmani',
    speciality: 'Informatique',
    module: 'Base de Données',
    level: 'L3',
    section: 'A',
    group: 'G1',
    count: 27,
    submitted: '2025-01-09T14:00:00',
    slaHours: 6,
    studentGrades: [
      { student: 'Yasmine Ounissi', matricule: '202012317', grade: 12.9 },
      { student: 'Fares Taleb', matricule: '202012203', grade: 10.4 },
      { student: 'Ines Hamidi', matricule: '202012319', grade: 13.7 },
    ],
  },
  {
    id: 4,
    teacher: 'Dr. Boualem',
    speciality: 'Informatique',
    module: 'Réseaux',
    level: 'L3',
    section: 'B',
    group: 'G3',
    count: 25,
    submitted: '2025-01-09T16:30:00',
    slaHours: 8,
    studentGrades: [
      { student: 'Aymen Ghali', matricule: '202012330', grade: 11.2 },
      { student: 'Rania Slimani', matricule: '202012202', grade: 9.5 },
      { student: 'Ilyes Benaissa', matricule: '202012329', grade: 14.1 },
    ],
  },
  {
    id: 5,
    teacher: 'Dr. Laadj',
    speciality: 'Informatique',
    module: 'Mathématiques',
    level: 'L3',
    section: 'A',
    group: 'G2',
    count: 29,
    submitted: '2025-01-08T11:00:00',
    slaHours: 2,
    studentGrades: [
      { student: 'Khalil Bouzid', matricule: '202012201', grade: 8.3 },
      { student: 'Houda Amrani', matricule: '202012204', grade: 13.6 },
      { student: 'Sonia Bellal', matricule: '202012340', grade: 12.8 },
    ],
  },
  {
    id: 6,
    teacher: 'Mme. Ferhat',
    speciality: 'Informatique',
    module: 'Anglais Technique',
    level: 'L2',
    section: 'A',
    group: 'G1',
    count: 26,
    submitted: '2025-01-08T15:00:00',
    slaHours: 4,
    studentGrades: [
      { student: 'Nourhane Rebbah', matricule: '202012335', grade: 15.9 },
      { student: 'Omar Bensalem', matricule: '202012305', grade: 10.7 },
      { student: 'Lamia Djeffal', matricule: '202012338', grade: 14.2 },
    ],
  },
  {
    id: 7,
    teacher: 'Dr. Messaoud',
    speciality: 'Informatique',
    module: 'Structures de Données',
    level: 'L3',
    section: 'B',
    group: 'G3',
    count: 28,
    submitted: '2025-01-07T09:00:00',
    slaHours: 0,
    studentGrades: [
      { student: 'Walid Bensaci', matricule: '202012346', grade: 12.4 },
      { student: 'Kenza Rezig', matricule: '202012347', grade: 14.9 },
      { student: 'Samir Zouaoui', matricule: '202012348', grade: 9.8 },
    ],
  },
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

export const PROFESSORS = [
  { id: 1, name: 'Dr. Karim Meziani', department: 'Informatique', email: 'k.meziani@pui.dz', phone: '+213 555 10 20 30', profile: 'Spécialiste en algorithmique et IA appliquée.', cv: 'Docteur en informatique, 12 ans d’enseignement, 24 publications.', plannedHours: 96, completedHours: 72 },
  { id: 2, name: 'Dr. Boualem', department: 'Informatique', email: 'boualem@pui.dz', phone: '+213 555 21 30 40', profile: 'Responsable du module Réseaux et sécurité.', cv: 'PhD réseaux, ex-architecte télécom, 10 ans d’expérience.', plannedHours: 84, completedHours: 84 },
  { id: 3, name: 'Mme. Rahmani', department: 'Informatique', email: 'rahmani@pui.dz', phone: '+213 555 34 45 56', profile: 'Enseignante BDD et systèmes d’information.', cv: 'Master SI, certification Oracle, 8 ans en université.', plannedHours: 72, completedHours: 60 },
  { id: 4, name: 'Dr. Laadj', department: 'Mathématiques', email: 'laadj@pui.dz', phone: '+213 555 67 78 89', profile: 'Mathématiques appliquées et probabilités.', cv: 'Docteur en probabilités, 15 ans d’enseignement supérieur.', plannedHours: 96, completedHours: 88 },
]

export const STUDENTS_DIRECTORY = [
  { id: 1, name: 'Mabrouk Benali', matricule: '202012345', speciality: 'Informatique', module: 'Algorithmique', level: 'L3', section: 'A', group: 'G2', average: 14.7, absences: 4, notes: [14.2, 14.8, 11.4, 16.4], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 14.2 }, { year: '2024-2025', semester: 'S2', gpa: 14.7 }] },
  { id: 2, name: 'Khalil Bouzid', matricule: '202012201', speciality: 'Informatique', module: 'Mathématiques', level: 'L3', section: 'A', group: 'G1', average: 10.9, absences: 5, notes: [8.3, 11.7, 12.2, 11.4], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 10.5 }, { year: '2024-2025', semester: 'S2', gpa: 10.9 }] },
  { id: 3, name: 'Rania Slimani', matricule: '202012202', speciality: 'Informatique', module: 'Réseaux', level: 'L3', section: 'B', group: 'G3', average: 11.8, absences: 5, notes: [9.5, 12.8, 13.1, 11.7], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 11.2 }, { year: '2024-2025', semester: 'S2', gpa: 11.8 }] },
  { id: 4, name: 'Ahmed Bouali', matricule: '202012301', speciality: 'Informatique', module: 'Base de Données', level: 'L2', section: 'A', group: 'G1', average: 13.9, absences: 2, notes: [15.5, 14.3, 12.7, 13.1], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 13.4 }, { year: '2024-2025', semester: 'S2', gpa: 13.9 }] },
  { id: 5, name: 'Sara Mansouri', matricule: '202012302', speciality: 'Informatique', module: 'Algorithmique', level: 'L2', section: 'A', group: 'G1', average: 14.5, absences: 1, notes: [14.8, 15.1, 13.9, 14.2], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 14.1 }, { year: '2024-2025', semester: 'S2', gpa: 14.5 }] },
]

export const SPECIALITIES_TREE = [
  {
    speciality: 'Informatique',
    levels: [
      {
        level: 'L3',
        sections: [
          {
            section: 'A',
            groups: [
              {
                group: 'G1',
                students: ['Khalil Bouzid', 'Ahmed Bouali', 'Sara Mansouri'],
                modules: ['Algorithmique', 'Réseaux', 'Base de Données'],
                teachers: ['Dr. Karim Meziani', 'Dr. Boualem', 'Mme. Rahmani'],
              },
              {
                group: 'G2',
                students: ['Mabrouk Benali', 'Nadia Cherif', 'Omar Bensalem'],
                modules: ['Mathématiques', 'Algorithmique', 'Anglais Technique'],
                teachers: ['Dr. Laadj', 'Dr. Karim Meziani', 'Mme. Ferhat'],
              },
            ],
          },
          {
            section: 'B',
            groups: [
              {
                group: 'G3',
                students: ['Rania Slimani', 'Ilyes Benaissa', 'Aymen Ghali'],
                modules: ['Structures de Données', 'Réseaux', 'Base de Données'],
                teachers: ['Dr. Messaoud', 'Dr. Boualem', 'Mme. Rahmani'],
              },
            ],
          },
        ],
      },
      {
        level: 'L2',
        sections: [
          {
            section: 'A',
            groups: [
              {
                group: 'G1',
                students: ['Ahmed Bouali', 'Sara Mansouri', 'Yasmine Ounissi'],
                modules: ['Algorithmique', 'Mathématiques', 'Anglais Technique'],
                teachers: ['Dr. Karim Meziani', 'Dr. Laadj', 'Mme. Ferhat'],
              },
            ],
          },
        ],
      },
    ],
  },
]

export const ABSENCE_JUSTIFICATIONS = [
  { id: 1, student: 'Mabrouk Benali', matricule: '202012345', speciality: 'Informatique', module: 'Algorithmique', level: 'L3', section: 'A', group: 'G2', file: 'justification-medicale.pdf', status: 'En attente' },
  { id: 2, student: 'Rania Slimani', matricule: '202012202', speciality: 'Informatique', module: 'Réseaux', level: 'L3', section: 'B', group: 'G3', file: 'attestation.png', status: 'Validée' },
]
