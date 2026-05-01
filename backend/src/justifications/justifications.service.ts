import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JustificationEntity, StudentEntity } from '../entities';

@Injectable()
export class JustificationsService {
  constructor(
    @InjectRepository(JustificationEntity)
    private readonly repo: Repository<JustificationEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
  ) {}

  async list() {
    return this.repo.find({ 
      relations: ['student', 'student.user'],
      order: { submittedAt: 'DESC' }
    });
  }

  async create(data: any) {
    const student = await this.studentRepo.findOne({ where: { id: data.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const justification = this.repo.create({
      student,
      module: data.module,
      fileName: data.fileName,
      fileContent: data.fileContent,
      absenceDate: data.absenceDate,
      status: 'pending',
    });
    return this.repo.save(justification);
  }

  async review(id: number, data: { status: 'approved' | 'rejected'; reviewComment?: string }) {
    const justification = await this.repo.findOne({ where: { id } });
    if (!justification) throw new NotFoundException('Justification not found');

    justification.status = data.status;
    justification.reviewComment = data.reviewComment || '';
    
    return this.repo.save(justification);
  }
}
