import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JustificationEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class JustificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(JustificationEntity)
    private readonly justificationsRepo: Repository<JustificationEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentsRepo: Repository<StudentEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.justificationsRepo.count();
    if (count > 0) return;
    const s1 = await this.studentsRepo.findOne({ where: { matricule: '202012345' } });
    const s2 = await this.studentsRepo.findOne({ where: { matricule: '202012202' } });
    const rows: Partial<JustificationEntity>[] = [];
    if (s1) {
      rows.push({
        student: s1,
        module: 'Algorithmique',
        fileName: 'justification-medicale.pdf',
        status: 'pending',
      });
    }
    if (s2) {
      rows.push({
        student: s2,
        module: 'Réseaux',
        fileName: 'attestation.png',
        status: 'approved',
      });
    }
    if (rows.length) await this.justificationsRepo.save(this.justificationsRepo.create(rows));
  }

  list() {
    return this.justificationsRepo.find({ order: { submittedAt: 'DESC' } });
  }

  async create(studentId: number, module: string, fileName: string) {
    const student = await this.studentsRepo.findOneOrFail({ where: { id: studentId } });
    return this.justificationsRepo.save(
      this.justificationsRepo.create({ student, module, fileName, status: 'pending' }),
    );
  }

  async review(id: number, status: 'approved' | 'rejected', reviewComment?: string) {
    const item = await this.justificationsRepo.findOneOrFail({ where: { id } });
    item.status = status;
    item.reviewComment = reviewComment ?? null;
    return this.justificationsRepo.save(item);
  }
}
