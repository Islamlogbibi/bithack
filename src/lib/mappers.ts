import type { AdminPendingValidation, ResourceItem, AbsenceAlertRow, WorkloadRow } from '../types/domain'

export function mapApiValidation(v: {
  id: number
  teacherName: string
  speciality?: string | null
  module: string
  level?: string | null
  section?: string | null
  groupName: string
  count: number
  submittedAt: string
  slaHours?: number
  studentGradesJson?: { student: string; matricule: string; grade: number }[] | null
  status: string
}): AdminPendingValidation {
  return {
    id: v.id,
    teacher: v.teacherName,
    speciality: v.speciality ?? '',
    module: v.module,
    level: v.level ?? '',
    section: v.section ?? '',
    group: v.groupName,
    count: v.count,
    submitted:
      typeof v.submittedAt === 'string'
        ? v.submittedAt
        : new Date(v.submittedAt as unknown as string | number | Date).toISOString(),
    slaHours: v.slaHours ?? 0,
    studentGrades: v.studentGradesJson ?? [],
    status: v.status,
  }
}

export function mapApiResource(r: {
  id: number
  title: string
  subject: string
  type: string
  fileType: string
  teacherName: string
  createdAt: string
  sizeLabel?: string | null
  isNew?: boolean
  fileContent?: string | null
  groupsJson?: string[] | null
  specialityName?: string | null
  levelName?: string | null
  sectionName?: string | null
  groupName?: string | null
}): ResourceItem {
  return {
    id: r.id,
    title: r.title,
    subject: r.subject,
    type: r.type,
    fileType: r.fileType,
    teacher: r.teacherName,
    size: r.sizeLabel ?? '—',
    date: (r.createdAt || '').slice(0, 10),
    isNew: !!r.isNew,
    fileContent: r.fileContent || undefined,
    targetGroups: r.groupsJson || undefined,
    specialityName: r.specialityName || undefined,
    levelName: r.levelName || undefined,
    sectionName: r.sectionName || undefined,
    groupName: r.groupName || undefined,
    createdAt: r.createdAt || new Date().toISOString(),
  }
}

export function mapApiAlert(a: {
  id: number
  subject: string
  risk: string
  absenceCount?: number | null
  maxAllowed?: number | null
  student: { matricule: string; user?: { fullName: string } }
}): AbsenceAlertRow {
  return {
    id: a.id,
    student: a.student?.user?.fullName ?? '',
    matricule: a.student.matricule,
    subject: a.subject,
    absences: a.absenceCount ?? 0,
    max: a.maxAllowed ?? 6,
    risk: a.risk as AbsenceAlertRow['risk'],
  }
}

export function mapWorkload(rows: unknown): WorkloadRow[] {
  if (!Array.isArray(rows)) return []
  return rows as WorkloadRow[]
}
