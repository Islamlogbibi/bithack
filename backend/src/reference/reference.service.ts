import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferenceBlobEntity } from '../entities';
import { Repository } from 'typeorm';

const PROFESSORS = [
  { id: 1, name: 'Dr. Karim Meziani', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', courses: ['Algorithmique', 'Structures de Données'], email: 'k.meziani@pui.dz', phone: '+213 555 10 20 30', profile: 'Spécialiste en algorithmique et IA appliquée.', cv: 'Docteur en informatique, 12 ans d’enseignement, 24 publications.', plannedHours: 96, completedHours: 72 },
  { id: 2, name: 'Dr. Boualem', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', courses: ['Réseaux', 'Sécurité des Réseaux'], email: 'boualem@pui.dz', phone: '+213 555 21 30 40', profile: 'Responsable du module Réseaux et sécurité.', cv: 'PhD réseaux, ex-architecte télécom, 10 ans d’expérience.', plannedHours: 84, completedHours: 84 },
  { id: 3, name: 'Mme. Rahmani', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', courses: ['Base de Données', 'Systèmes d’Information'], email: 'rahmani@pui.dz', phone: '+213 555 34 45 56', profile: 'Enseignante BDD et systèmes d’information.', cv: 'Master SI, certification Oracle, 8 ans en université.', plannedHours: 72, completedHours: 60 },
  { id: 4, name: 'Dr. Laadj', faculty: 'Faculté des Sciences et Technologies', department: 'Mathématiques', courses: ['Mathématiques', 'Probabilités'], email: 'laadj@pui.dz', phone: '+213 555 67 78 89', profile: 'Mathématiques appliquées et probabilités.', cv: 'Docteur en probabilités, 15 ans d’enseignement supérieur.', plannedHours: 96, completedHours: 88 },
  { id: 5, name: 'Mme. Benali', faculty: 'Faculté des Sciences et Technologies', department: 'Physique', courses: ['Physique Générale', 'Mécanique'], email: 'm.benali@pui.dz', phone: '+213 555 71 44 88', profile: 'Enseignante en physique fondamentale.', cv: 'Doctorat en physique, 9 ans en enseignement supérieur.', plannedHours: 70, completedHours: 58 },
];

const STUDENTS_DIRECTORY = [
  { id: 1, name: 'Mabrouk Benali', matricule: '202012345', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', speciality: 'Informatique', module: 'Algorithmique', level: 'L3', section: 'A', group: 'G2', average: 14.7, absences: 4, notes: [14.2, 14.8, 11.4, 16.4], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 14.2 }, { year: '2024-2025', semester: 'S2', gpa: 14.7 }] },
  { id: 2, name: 'Khalil Bouzid', matricule: '202012201', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', speciality: 'Informatique', module: 'Mathématiques', level: 'L3', section: 'A', group: 'G1', average: 10.9, absences: 5, notes: [8.3, 11.7, 12.2, 11.4], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 10.5 }, { year: '2024-2025', semester: 'S2', gpa: 10.9 }] },
  { id: 3, name: 'Rania Slimani', matricule: '202012202', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', speciality: 'Informatique', module: 'Réseaux', level: 'L3', section: 'B', group: 'G3', average: 11.8, absences: 5, notes: [9.5, 12.8, 13.1, 11.7], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 11.2 }, { year: '2024-2025', semester: 'S2', gpa: 11.8 }] },
  { id: 4, name: 'Ahmed Bouali', matricule: '202012301', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', speciality: 'Informatique', module: 'Base de Données', level: 'L2', section: 'A', group: 'G1', average: 13.9, absences: 2, notes: [15.5, 14.3, 12.7, 13.1], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 13.4 }, { year: '2024-2025', semester: 'S2', gpa: 13.9 }] },
  { id: 5, name: 'Sara Mansouri', matricule: '202012302', faculty: 'Faculté des Sciences et Technologies', department: 'Informatique', speciality: 'Informatique', module: 'Algorithmique', level: 'L2', section: 'A', group: 'G1', average: 14.5, absences: 1, notes: [14.8, 15.1, 13.9, 14.2], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 14.1 }, { year: '2024-2025', semester: 'S2', gpa: 14.5 }] },
  { id: 6, name: 'Nour El Houda Kacem', matricule: '202112410', faculty: 'Faculté des Sciences et Technologies', department: 'Mathématiques', speciality: 'Mathématiques Appliquées', module: 'Analyse', level: 'M1', section: 'A', group: 'G1', average: 15.3, absences: 1, notes: [15.8, 14.7, 15.5], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 15.1 }, { year: '2024-2025', semester: 'S2', gpa: 15.3 }] },
  { id: 7, name: 'Amine Bouzid', matricule: '202212520', faculty: 'Faculté des Sciences et Technologies', department: 'Physique', speciality: 'Physique Fondamentale', module: 'Mécanique', level: 'L1', section: 'A', group: 'G2', average: 12.6, absences: 2, notes: [13.2, 11.8, 12.9], gpaByPeriod: [{ year: '2024-2025', semester: 'S1', gpa: 12.4 }, { year: '2024-2025', semester: 'S2', gpa: 12.6 }] },
];

const SPECIALITIES_TREE = [
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
];

const WORKLOAD = [
  { teacher: 'Dr. Meziani', planned: 96, completed: 72 },
  { teacher: 'Dr. Boualem', planned: 84, completed: 84 },
  { teacher: 'Mme. Rahmani', planned: 72, completed: 60 },
  { teacher: 'Dr. Laadj', planned: 96, completed: 88 },
  { teacher: 'Mme. Ferhat', planned: 60, completed: 52 },
  { teacher: 'Dr. Messaoud', planned: 84, completed: 70 },
];

@Injectable()
export class ReferenceService implements OnModuleInit {
  constructor(@InjectRepository(ReferenceBlobEntity) private readonly repo: Repository<ReferenceBlobEntity>) {}

  async onModuleInit() {
    const rows: { key: string; data: unknown }[] = [
      { key: 'professors', data: PROFESSORS },
      { key: 'students-directory', data: STUDENTS_DIRECTORY },
      { key: 'specialities-tree', data: SPECIALITIES_TREE },
      { key: 'workload', data: WORKLOAD },
    ];
    for (const row of rows) {
      const exists = await this.repo.exist({ where: { key: row.key } });
      if (!exists) await this.repo.save(this.repo.create(row));
    }
  }

  async get(key: string) {
    const row = await this.repo.findOne({ where: { key } });
    return row?.data ?? null;
  }
}
