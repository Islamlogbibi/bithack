import type { TeacherUser } from '../types/domain'

export const mockTeacher: TeacherUser = {
  id: 2,
  name: 'Dr. Karim Meziani',
  email: 'karim.meziani@example.com',
  role: 'teacher',
  department: 'Informatique',
  subjects: ['Algorithmique', 'Réseaux', 'Base de données'],
  groups: ['G1', 'G2', 'G3'],
  hoursPlanned: 120,
  hoursCompleted: 84,
  pendingGrades: [
    { student: 'Yasmine Gharbi', matricule: '2023-4210', group: 'G1', td: 14, exam: null, status: 'En attente' },
    { student: 'Omar Djemai', matricule: '2023-4531', group: 'G2', td: 12, exam: null, status: 'En attente' },
    { student: 'Nadia Belkacem', matricule: '2023-4328', group: 'G3', td: 15, exam: null, status: 'En attente' },
  ],
}

export const mockTeacherSchedule = [
  { day: 'Samedi', time: '08:00', group: 'G1', course: 'Algorithmique', room: 'Amphi A', type: 'Cours' },
  { day: 'Samedi', time: '09:45', group: 'G2', course: 'Réseaux', room: 'Salle R3', type: 'TD' },
  { day: 'Samedi', time: '11:30', group: 'G3', course: 'Base de données', room: 'Lab DB', type: 'TP' },
  { day: 'Lundi', time: '14:00', group: 'G1', course: 'Programmation', room: 'Lab Web', type: 'TP' },
  { day: 'Mardi', time: '08:00', group: 'G2', course: 'Systèmes d’exploitation', room: 'Salle B05', type: 'Cours' },
  { day: 'Mercredi', time: '15:45', group: 'G3', course: 'Génie logiciel', room: 'Salle C03', type: 'TD' },
]
