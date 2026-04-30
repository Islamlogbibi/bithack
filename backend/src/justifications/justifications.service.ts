import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JustificationEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class JustificationsService {
  constructor(
    @InjectRepository(JustificationEntity)
    private readonly justificationsRepo: Repository<JustificationEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentsRepo: Repository<StudentEntity>,
  ) {}

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
