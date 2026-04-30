import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity, UserEntity } from '../entities';
import * as bcrypt from 'bcrypt';

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
    const defaultStudentUser = await this.usersRepo.findOne({
      where: { email: 'student@pui.dz' },
    });
    if (!defaultStudentUser) return;
    await this.studentsRepo.save(
      this.studentsRepo.create({
        user: defaultStudentUser,
        matricule: '202012345',
        speciality: 'Informatique',
        level: 'L3',
        section: 'A',
        groupName: 'G2',
        average: 14.7,
        absences: 4,
      }),
    );
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
