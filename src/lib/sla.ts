// ── SLA Utilities ──────────────────────────────────────────────

export type SlaResourceStatus = 'pending' | 'published' | 'late'
export type SlaGradeStatus = 'waiting' | 'validated' | 'late'
export type ProgresSyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface SlaResource {
  id: string
  title: string
  createdAt: Date
  publishedAt?: Date
}

export interface SlaGrade {
  id: string
  submittedAt: Date
  validatedAt?: Date
}

/** Returns the absolute hour difference between two dates. */
export const hoursDiff = (date1: Date, date2: Date): number =>
  Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60)

/** Compute SLA status for a resource (48 h). */
export function getResourceSlaStatus(resource: SlaResource): SlaResourceStatus {
  if (resource.publishedAt) return 'published'
  const elapsed = hoursDiff(new Date(resource.createdAt), new Date())
  return elapsed > 48 ? 'late' : 'pending'
}

/** Compute remaining SLA hours for a resource (48 h). */
export function getResourceSlaRemaining(resource: SlaResource): number {
  if (resource.publishedAt) return 0
  const elapsed = hoursDiff(new Date(resource.createdAt), new Date())
  return Math.max(0, 48 - elapsed)
}

/** Compute SLA status for a grade validation (72 h). */
export function getGradeSlaStatus(grade: SlaGrade): SlaGradeStatus {
  if (grade.validatedAt) return 'validated'
  const elapsed = hoursDiff(new Date(grade.submittedAt), new Date())
  return elapsed > 72 ? 'late' : 'waiting'
}

/** Compute remaining SLA hours for a grade validation (72 h). */
export function getGradeSlaRemaining(grade: SlaGrade): number {
  if (grade.validatedAt) return 0
  const elapsed = hoursDiff(new Date(grade.submittedAt), new Date())
  return Math.max(0, 72 - elapsed)
}

/** Mock PROGRES sync function. */
export function createProgresSync(
  setStatus: (s: ProgresSyncStatus) => void
) {
  return async () => {
    setStatus('loading')
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // 90% chance success, 10% chance failure for realism
        if (Math.random() > 0.1) {
          setStatus('success')
        } else {
          setStatus('error')
        }
        resolve()
      }, 1500)
    })
  }
}
