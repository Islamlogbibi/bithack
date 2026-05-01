import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity, UserEntity } from '../entities';
import * as bcrypt from 'bcrypt';

const MAIN_GRADES = [
  { subject: 'Algorithmique', td: 13, exam: 15, final: 14.2, status: 'Validé', credits: 6 },
  { subject: 'Réseaux', td: 16, exam: 14, final: 14.8, status: 'Validé', credits: 4 },
  { subject: 'Base de Données', td: 12, exam: 11, final: 11.4, status: 'En attente', credits: 5 },
  { subject: 'Mathématiques', td: 17, exam: 16, final: 16.4, status: 'Validé', credits: 4 },
  { subject: 'Anglais Technique', td: 15, exam: 14, final: 14.6, status: 'Validé', credits: 2 },
];

@Injectable()
export class StudentsService implements OnModuleInit {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepo: Repository<StudentEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.studentsRepo.count();
    if (count > 0) return;

    const mainUser = await this.usersRepo.findOne({ where: { email: 'student@pui.dz' } });
    if (!mainUser) return;

    await this.studentsRepo.save(
      this.studentsRepo.create({
        user: mainUser,
        matricule: '202012345',
        speciality: 'Informatique',
        level: 'L3',
        section: 'A',
        groupName: 'G2',
        average: 14.7,
        absences: 4,
        yearLabel: 'L3 Informatique',
        gradesJson: MAIN_GRADES,
        absencesByModuleJson: { algo: 4, networks: 1, db: 2 },
        displayFaculty: 'Faculté des Sciences et Technologies',
        displayDepartment: 'Informatique',
        displayModule: 'Algorithmique',
        notesJson: [14.2, 14.8, 11.4, 16.4],
        gpaByPeriodJson: [
          { year: '2024-2025', semester: 'S1', gpa: 14.2 },
          { year: '2024-2025', semester: 'S2', gpa: 14.7 },
        ],
      }),
    );

    const extras = [
      {
        email: 'k.bouzid@pui.dz',
        matricule: '202012201',
        speciality: 'Informatique',
        level: 'L3',
        section: 'A',
        groupName: 'G1',
        average: 10.9,
        absences: 5,
        displayFaculty: 'Faculté des Sciences et Technologies',
        displayDepartment: 'Informatique',
        displayModule: 'Mathématiques',
        notesJson: [8.3, 11.7, 12.2, 11.4],
        gpaByPeriodJson: [
          { year: '2024-2025', semester: 'S1', gpa: 10.5 },
          { year: '2024-2025', semester: 'S2', gpa: 10.9 },
        ],
      },
      {
        email: 'r.slimani@pui.dz',
        matricule: '202012202',
        speciality: 'Informatique',
        level: 'L3',
        section: 'B',
        groupName: 'G3',
        average: 11.8,
        absences: 5,
        displayFaculty: 'Faculté des Sciences et Technologies',
        displayDepartment: 'Informatique',
        displayModule: 'Réseaux',
        notesJson: [9.5, 12.8, 13.1, 11.7],
        gpaByPeriodJson: [
          { year: '2024-2025', semester: 'S1', gpa: 11.2 },
          { year: '2024-2025', semester: 'S2', gpa: 11.8 },
        ],
      },
      {
        email: 'f.taleb@pui.dz',
        matricule: '202012203',
        speciality: 'Informatique',
        level: 'L3',
        section: 'A',
        groupName: 'G1',
        average: 11.2,
        absences: 4,
        displayFaculty: 'Faculté des Sciences et Technologies',
        displayDepartment: 'Informatique',
        displayModule: 'Réseaux',
      },
      {
        email: 'h.amrani@pui.dz',
        matricule: '202012204',
        speciality: 'Informatique',
        level: 'L3',
        section: 'A',
        groupName: 'G1',
        average: 12.5,
        absences: 3,
        displayFaculty: 'Faculté des Sciences et Technologies',
        displayDepartment: 'Informatique',
        displayModule: 'Mathématiques',
      },
    ];

    for (const row of extras) {
      const { email, ...rest } = row;
      const u = await this.usersRepo.findOne({ where: { email } });
      if (!u) continue;
      await this.studentsRepo.save(this.studentsRepo.create({ user: u, ...rest }));
    }
  }

  async list(filters: Record<string, string | undefined>) {
    const qb = this.studentsRepo.createQueryBuilder('student').leftJoinAndSelect('student.user', 'user');
    if (filters.query) {
      qb.andWhere('(LOWER(user.fullName) LIKE :q OR student.matricule LIKE :q)', {
        q: `%${filters.query.toLowerCase()}%`,
      });
    }
    if (filters.speciality) qb.andWhere('student.speciality = :speciality', { speciality: filters.speciality });
    if (filters.level) qb.andWhere('student.level = :level', { level: filters.level });
    if (filters.section) qb.andWhere('student.section = :section', { section: filters.section });
    if (filters.group) qb.andWhere('student.groupName = :groupName', { groupName: filters.group });
    return qb.getMany();
  }

  async findByUserId(userId: number) {
    return this.studentsRepo.findOne({ where: { user: { id: userId } }, relations: { user: true } });
  }

  async create(payload: { name: string; email: string; password: string; matricule: string; speciality: string; level: string; section: string; group: string }) {
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.usersRepo.save(
      this.usersRepo.create({
        fullName: payload.name,
        email: payload.email,
        passwordHash,
        role: 'student',
      }),
    );
    return this.studentsRepo.save(
      this.studentsRepo.create({
        user,
        matricule: payload.matricule,
        speciality: payload.speciality,
        level: payload.level,
        section: payload.section,
        groupName: payload.group,
      }),
    );
  }

  async remove(id: number) {
    const student = await this.studentsRepo.findOne({ where: { id }, relations: { user: true } });
    if (!student) throw new NotFoundException('Student not found');
    await this.studentsRepo.delete(id);
    await this.usersRepo.delete(student.user.id);
    return { success: true };
  }
}
