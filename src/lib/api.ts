const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('pui_token')
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() })
  if (res.status === 401) {
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (res.status === 401) {
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(await res.text())
}

export interface LoginResponse {
  accessToken: string
  profile: import('../types/domain').AppUser
}

export function loginRequest(email: string, password: string) {
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    if (!res.ok) throw new Error('Invalid credentials')
    return res.json() as Promise<LoginResponse>
  })
}

// =======================
// ATTENDANCE ALERTS
// =======================
export function getAttendanceAlerts() {
  return apiGet<any[]>('/attendance/alerts')
}
export function dismissAttendanceAlert(id: number) {
  return apiPatch<void>(`/attendance/alerts/${id}/dismiss`)
}

// =======================
// JUSTIFICATIONS
// =======================
export function getJustifications() {
  return apiGet<any[]>('/justifications')
}
export function createJustification(data: { 
  studentId: number; 
  module: string; 
  fileName: string;
  fileContent?: string | null;
  absenceDate?: string;
  absenceDay?: string;
  absenceTime?: string;
}) {
  return apiPost<void>('/justifications', data)
}
export function reviewJustification(id: number, data: { status: 'approved' | 'rejected'; comment?: string }) {
  return apiPatch<void>(`/justifications/${id}/review`, data)
}

// =======================
// VALIDATIONS
// =======================
export function getValidations() {
  return apiGet<any[]>('/validations')
}
export function reviewValidation(id: number, status: 'approved' | 'rejected') {
  return apiPost<void>(`/validations/${id}/review`, { status })
}

// =======================
// MESSAGES
// =======================
export function getMessages(conversationId: string) {
  return apiGet<any[]>(`/messages?conversationId=${encodeURIComponent(conversationId)}`)
}
export function sendMessage(data: { conversationId: string; senderId: number; content: string }) {
  return apiPost<void>('/messages', data)
}

// =======================
// RESOURCES
// =======================
export function getResources() {
  return apiGet<any[]>('/resources')
}
export function createResource(data: Record<string, unknown>) {
  return apiPost<void>('/resources', data)
}
export function deleteResource(id: number) {
  return apiDelete(`/resources/${id}`)
}

// =======================
// ADMIN & DEAN
// =======================
export function getSpecialitiesTree() {
  return apiGet<any[]>('/specialities/tree')
}

export function getStudents(filters: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.append(k, v)
  })
  const qs = params.toString()
  return apiGet<any[]>(`/students${qs ? '?' + qs : ''}`)
}

export function getStudentsByGroup(group: string) {
  return getStudents({ group })
}

export function createStudent(data: any) {
  return apiPost<void>('/students', data)
}
export function deleteStudent(id: number) {
  return apiDelete(`/students/${id}`)
}
export function getTeachers() {
  return apiGet<any[]>('/teachers')
}

export function updateTeacher(id: number, data: any) {
  return apiPatch<void>(`/teachers/${id}`, data)
}

// =======================
// SCHEDULES
// =======================
export function getScheduleByScope(scope: string, scopeId: string) {
  return apiGet<any[]>(`/schedules/${scope}/${scopeId}`)
}

export function getAllSchedules() {
  return apiGet<any[]>('/schedules')
}

export function createSchedule(data: any) {
  return apiPost<void>('/schedules', data)
}

// =======================
// REFERENCE
// =======================
export function getReference<T>(key: string) {
  return apiGet<T>(`/reference/${key}`)
}
export function saveReference<T>(key: string, data: T) {
  return apiPost<T>(`/reference/${key}`, data)
}

// =======================
// ASSIGNMENTS
// =======================
export function getAssignments(groups?: string[]) {
  // Mock implementation for demo
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      import('../data/mockAssignments').then(({ mockAssignments }) => {
        let filtered = mockAssignments;
        if (groups && groups.length > 0) {
          filtered = mockAssignments.filter(assignment =>
            assignment.groups?.some(group => groups.includes(group))
          );
        }
        resolve(filtered);
      });
    }, 500); // Simulate network delay
  });
}
export function getTeacherAssignments(name: string) {
  return apiGet<any[]>(`/assignments/teacher/${encodeURIComponent(name)}`)
}
export function createAssignment(data: any) {
  return apiPost<void>('/assignments', data)
}
export function submitAssignment(data: {
  assignmentId: number
  studentId: number
  studentName: string
  fileName: string
  fileContent: string
}) {
  // Mock implementation for demo
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('Mock submission:', data);
      resolve();
    }, 1000); // Simulate upload delay
  });
}
export function getAssignmentSubmissions(id: number) {
  // Mock implementation for demo
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      import('../data/mockAssignments').then(({ mockSubmissions }) => {
        const submissions = mockSubmissions.filter(sub => sub.assignmentId === id);
        resolve(submissions);
      });
    }, 300); // Simulate network delay
  });
}
