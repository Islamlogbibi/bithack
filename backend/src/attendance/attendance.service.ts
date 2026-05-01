import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceAlertEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';

const SEED: Array<{ matricule: string; subject: string; risk: 'low' | 'medium' | 'high'; absenceCount: number; maxAllowed: number }> = [
  { matricule: '202012201', subject: 'Algorithmique', risk: 'high', absenceCount: 5, maxAllowed: 6 },
  { matricule: '202012202', subject: 'Base de Données', risk: 'high', absenceCount: 5, maxAllowed: 6 },
  { matricule: '202012203', subject: 'Réseaux', risk: 'medium', absenceCount: 4, maxAllowed: 6 },
  { matricule: '202012345', subject: 'Algorithmique', risk: 'medium', absenceCount: 4, maxAllowed: 6 },
  { matricule: '202012204', subject: 'Mathématiques', risk: 'low', absenceCount: 3, maxAllowed: 6 },
];

@Injectable()
export class AttendanceService implements OnModuleInit {
  constructor(
    @InjectRepository(AttendanceAlertEntity) private readonly repo: Repository<AttendanceAlertEntity>,
    @InjectRepository(StudentEntity) private readonly studentsRepo: Repository<StudentEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    for (const row of SEED) {
      const student = await this.studentsRepo.findOne({ where: { matricule: row.matricule } });
      if (!student) continue;
      await this.repo.save(
        this.repo.create({
          student,
          subject: row.subject,
          risk: row.risk,
          status: 'open',
          absenceCount: row.absenceCount,
          maxAllowed: row.maxAllowed,
        }),
      );
    }
  }
  alerts() {
    return this.repo.find();
  }
  dismiss(id: number) {
    return this.repo.update({ id }, { status: 'dismissed' });
  }
}
