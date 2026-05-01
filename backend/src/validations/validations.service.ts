import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationEntity } from '../entities';
import { Repository } from 'typeorm';

const SEED: Array<{
  teacherName: string;
  speciality: string;
  module: string;
  level: string;
  section: string;
  groupName: string;
  count: number;
  submittedAt: string;
  slaHours: number;
  studentGradesJson: { student: string; matricule: string; grade: number }[];
}> = [
  {
    teacherName: 'Dr. Karim Meziani',
    speciality: 'Informatique',
    module: 'Algorithmique',
    level: 'L2',
    section: 'A',
    groupName: 'G1',
    count: 28,
    submittedAt: '2025-01-10T09:30:00.000Z',
    slaHours: 18,
    studentGradesJson: [
      { student: 'Ahmed Bouali', matricule: '202012301', grade: 15.5 },
      { student: 'Sara Mansouri', matricule: '202012302', grade: 14.8 },
      { student: 'Nadia Cherif', matricule: '202012304', grade: 13.4 },
    ],
  },
  {
    teacherName: 'Dr. Karim Meziani',
    speciality: 'Informatique',
    module: 'Algorithmique',
    level: 'L3',
    section: 'A',
    groupName: 'G2',
    count: 30,
    submittedAt: '2025-01-10T10:15:00.000Z',
    slaHours: 16,
    studentGradesJson: [
      { student: 'Mabrouk Benali', matricule: '202012345', grade: 14.2 },
      { student: 'Lina Sadoud', matricule: '202012322', grade: 16.1 },
      { student: 'Farid Bousselah', matricule: '202012325', grade: 11.7 },
    ],
  },
  {
    teacherName: 'Mme. Rahmani',
    speciality: 'Informatique',
    module: 'Base de Données',
    level: 'L3',
    section: 'A',
    groupName: 'G1',
    count: 27,
    submittedAt: '2025-01-09T14:00:00.000Z',
    slaHours: 6,
    studentGradesJson: [
      { student: 'Yasmine Ounissi', matricule: '202012317', grade: 12.9 },
      { student: 'Fares Taleb', matricule: '202012203', grade: 10.4 },
      { student: 'Ines Hamidi', matricule: '202012319', grade: 13.7 },
    ],
  },
  {
    teacherName: 'Dr. Boualem',
    speciality: 'Informatique',
    module: 'Réseaux',
    level: 'L3',
    section: 'B',
    groupName: 'G3',
    count: 25,
    submittedAt: '2025-01-09T16:30:00.000Z',
    slaHours: 8,
    studentGradesJson: [
      { student: 'Aymen Ghali', matricule: '202012330', grade: 11.2 },
      { student: 'Rania Slimani', matricule: '202012202', grade: 9.5 },
      { student: 'Ilyes Benaissa', matricule: '202012329', grade: 14.1 },
    ],
  },
  {
    teacherName: 'Dr. Laadj',
    speciality: 'Informatique',
    module: 'Mathématiques',
    level: 'L3',
    section: 'A',
    groupName: 'G2',
    count: 29,
    submittedAt: '2025-01-08T11:00:00.000Z',
    slaHours: 2,
    studentGradesJson: [
      { student: 'Khalil Bouzid', matricule: '202012201', grade: 8.3 },
      { student: 'Houda Amrani', matricule: '202012204', grade: 13.6 },
      { student: 'Sonia Bellal', matricule: '202012340', grade: 12.8 },
    ],
  },
  {
    teacherName: 'Mme. Ferhat',
    speciality: 'Informatique',
    module: 'Anglais Technique',
    level: 'L2',
    section: 'A',
    groupName: 'G1',
    count: 26,
    submittedAt: '2025-01-08T15:00:00.000Z',
    slaHours: 4,
    studentGradesJson: [
      { student: 'Nourhane Rebbah', matricule: '202012335', grade: 15.9 },
      { student: 'Omar Bensalem', matricule: '202012305', grade: 10.7 },
      { student: 'Lamia Djeffal', matricule: '202012338', grade: 14.2 },
    ],
  },
  {
    teacherName: 'Dr. Messaoud',
    speciality: 'Informatique',
    module: 'Structures de Données',
    level: 'L3',
    section: 'B',
    groupName: 'G3',
    count: 28,
    submittedAt: '2025-01-07T09:00:00.000Z',
    slaHours: 0,
    studentGradesJson: [
      { student: 'Walid Bensaci', matricule: '202012346', grade: 12.4 },
      { student: 'Kenza Rezig', matricule: '202012347', grade: 14.9 },
      { student: 'Samir Zouaoui', matricule: '202012348', grade: 9.8 },
    ],
  },
];

@Injectable()
export class ValidationsService implements OnModuleInit {
  constructor(@InjectRepository(ValidationEntity) private readonly repo: Repository<ValidationEntity>) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    for (const row of SEED) {
      await this.repo.save(
        this.repo.create({
          ...row,
          submittedAt: new Date(row.submittedAt),
          status: 'pending',
        }),
      );
    }
  }

  list() {
    return this.repo.find({ order: { submittedAt: 'DESC' } });
  }

  create(data: {
    teacherName: string;
    module: string;
    groupName: string;
    count: number;
    slaHours?: number;
    studentGradesJson?: { student: string; matricule: string; grade: number }[];
  }) {
    return this.repo.save(
      this.repo.create({
        teacherName: data.teacherName,
        module: data.module,
        groupName: data.groupName,
        count: data.count,
        slaHours: data.slaHours ?? 24,
        studentGradesJson: data.studentGradesJson ?? [],
        status: 'pending',
      }),
    );
  }

  review(id: number, status: 'approved' | 'rejected') {
    return this.repo.update({ id }, { status });
  }
}
