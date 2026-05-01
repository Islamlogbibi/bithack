import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceAlertEntity, StudentEntity } from '../entities';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceAlertEntity)
    private readonly alertRepo: Repository<AttendanceAlertEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
  ) {}

  async listAlerts() {
    return this.alertRepo.find({
      where: { dismissed: false },
      relations: ['student', 'student.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async createAlert(data: { studentId: number; module: string; absences: number; severity: 'low' | 'medium' | 'high' }) {
    const student = await this.studentRepo.findOne({ where: { id: data.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const alert = this.alertRepo.create({
      student,
      module: data.module,
      absences: data.absences,
      severity: data.severity,
    });
    return this.alertRepo.save(alert);
  }

  async dismissAlert(id: number) {
    return this.alertRepo.update(id, { dismissed: true });
  }
}
