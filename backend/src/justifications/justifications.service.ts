import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Justification, JustificationStatus } from './entities/justification.entity';

@Injectable()
export class JustificationsService {
  constructor(
    @InjectRepository(Justification)
    private justificationRepository: Repository<Justification>,
  ) {}

  async findAll(): Promise<Justification[]> {
    return this.justificationRepository.find({
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Justification> {
    const justification = await this.justificationRepository.findOne({
      where: { id },
      relations: ['student'],
    });
    
    if (!justification) {
      throw new NotFoundException(`Justification with ID ${id} not found`);
    }
    
    return justification;
  }

  async findByStudent(studentId: string): Promise<Justification[]> {
    return this.justificationRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async findPending(): Promise<Justification[]> {
    return this.justificationRepository.find({
      where: { status: JustificationStatus.PENDING },
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createData: Partial<Justification>): Promise<Justification> {
    const justification = this.justificationRepository.create({
      ...createData,
      status: JustificationStatus.PENDING,
    });
    return this.justificationRepository.save(justification);
  }

  async approve(id: string, adminComment?: string): Promise<Justification> {
    const justification = await this.findOne(id);
    justification.status = JustificationStatus.APPROVED;
    justification.adminComment = adminComment;
    return this.justificationRepository.save(justification);
  }

  async reject(id: string, adminComment: string): Promise<Justification> {
    const justification = await this.findOne(id);
    justification.status = JustificationStatus.REJECTED;
    justification.adminComment = adminComment;
    return this.justificationRepository.save(justification);
  }

  async getStats(): Promise<any> {
    const all = await this.justificationRepository.find();
    const pending = all.filter(j => j.status === JustificationStatus.PENDING).length;
    const approved = all.filter(j => j.status === JustificationStatus.APPROVED).length;
    const rejected = all.filter(j => j.status === JustificationStatus.REJECTED).length;

    return { total: all.length, pending, approved, rejected };
  }
}