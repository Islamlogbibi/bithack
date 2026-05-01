export type Role = 'student' | 'teacher' | 'admin' | 'dean'

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

export interface DeanUser {
  id: number
  name: string
  email: string
  role: 'dean'
  faculty: string
}

export type AppUser = StudentUser | TeacherUser | AdminUser | DeanUser

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
  studentGrades: { student: string; matricule: string; grade: number }[]
}

export interface ResourceItem {
  id: number
  title: string
  subject: string
  type: string
  fileType: string
  teacher: string
  size: string
  date: string
  isNew: boolean
}

export interface AbsenceAlertRow {
  id: number
  student: string
  matricule: string
  subject: string
  absences: number
  max: number
  risk: 'high' | 'medium' | 'low'
}

export interface WorkloadRow {
  teacher: string
  planned: number
  completed: number
}

export interface ProfessorRow {
  id: number
  name: string
  faculty: string
  department: string
  courses: string[]
  email: string
  phone: string
  profile: string
  cv: string
  plannedHours: number
  completedHours: number
}

export interface StudentDirectoryRow {
  id: number
  name: string
  matricule: string
  faculty: string
  department: string
  speciality: string
  module: string
  level: string
  section: string
  group: string
  average: number
  absences: number
  notes: number[]
  gpaByPeriod: { year: string; semester: string; gpa: number }[]
}

export interface SpecialityTreeRoot {
  speciality: string
  levels: {
    level: string
    sections: {
      section: string
      groups: {
        group: string
        students: string[]
        modules: string[]
        teachers: string[]
      }[]
    }[]
  }[]
}
