import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceAlertEntity, StudentEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService implements OnModuleInit {
  constructor(
    @InjectRepository(AttendanceAlertEntity) private readonly repo: Repository<AttendanceAlertEntity>,
    @InjectRepository(StudentEntity) private readonly studentsRepo: Repository<StudentEntity>,
    @InjectRepository(UserEntity) private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;

    // Seed a few alerts for the default seeded student (created in StudentsService.onModuleInit)
    const student = await this.studentsRepo.findOne({ where: { matricule: '202012345' } });
    if (!student) return;

    await this.repo.save(
      this.repo.create([
        { student, subject: 'Algorithmique', risk: 'high', status: 'open' },
        { student, subject: 'Base de Données', risk: 'medium', status: 'open' },
        { student, subject: 'Réseaux', risk: 'low', status: 'open' },
      ]),
    );
  }
  alerts() {
    return this.repo.find();
  }
  dismiss(id: number) {
    return this.repo.update({ id }, { status: 'dismissed' });
  }
}
