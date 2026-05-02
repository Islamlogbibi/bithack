import type { StudentUser } from '../types/domain'

export const mockStudent: StudentUser = {
  id: 1,
  name: 'Sara Ben Ali',
  email: 'sara.benali@example.com',
  role: 'student',
  matricule: '2024-6543',
  group: 'G1',
  year: '2024-2025',
  level: 'Licence 1',
  speciality: 'Informatique',
  section: 'A',
  displayDepartment: 'Sciences et Technologies',
  gpa: 13.58,
  absences: {
    algo: 4,
    networks: 1,
    db: 2,
  },
  grades: [
    { subject: 'Algorithmique', td: 15, exam: 14, final: 14.5, status: 'Validé', credits: 4 },
    { subject: 'Mathématiques', td: 12, exam: 11, final: 11.5, status: 'Validé', credits: 4 },
    { subject: 'Physique', td: 10, exam: 9, final: 9.5, status: 'En attente', credits: 3 },
    { subject: 'Anglais', td: 17, exam: 16, final: 16.5, status: 'Validé', credits: 2 },
    { subject: 'Programmation', td: 13, exam: 12, final: 12.5, status: 'Validé', credits: 5 },
    { subject: 'Système d’exploitation', td: 11, exam: 10, final: 10.5, status: 'Validé', credits: 3 },
    { subject: 'Statistiques', td: 14, exam: 13, final: 13.5, status: 'Validé', credits: 4 },
    { subject: 'Base de données', td: 8, exam: 9, final: 8.5, status: 'Rejeté', credits: 3 },
  ],
  schedule: [
    { day: '', time: '08:00 - 9:30', subject: 'Programmation Web', room: 'Lab Web', type: 'TP' },
    { day: '', time: '14:00 - 15:30', subject: 'Algorithmique', room: 'Amphi A', type: 'Cours' },
  ],
}
