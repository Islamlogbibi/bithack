import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, AlertStatus, AlertType, AlertPriority } from './entities/alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
  ) {}

  async findAll(): Promise<Alert[]> {
    return this.alertRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id },
    });
    
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    
    return alert;
  }

  async findByStudent(studentId: string): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTargetRole(targetRole: string): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { targetRole },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnread(targetRole: string): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { targetRole, status: AlertStatus.UNREAD },
      order: { createdAt: 'DESC' },
    });
  }

  async create(createData: Partial<Alert>): Promise<Alert> {
    const alert = this.alertRepository.create(createData);
    return this.alertRepository.save(alert);
  }

  async markAsRead(id: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.status = AlertStatus.READ;
    return this.alertRepository.save(alert);
  }

  async markAllAsRead(targetRole: string): Promise<void> {
    await this.alertRepository.update(
      { targetRole, status: AlertStatus.UNREAD },
      { status: AlertStatus.READ },
    );
  }

  async resolve(id: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.status = AlertStatus.RESOLVED;
    return this.alertRepository.save(alert);
  }

  async delete(id: string): Promise<void> {
    const result = await this.alertRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
  }

  // Create absence threshold alert
  async createAbsenceAlert(
    studentId: string,
    module: string,
    absenceCount: number,
  ): Promise<Alert> {
    return this.create({
      title: 'Absence Threshold Reached',
      message: `Student has reached ${absenceCount} absences in ${module}. Maximum allowed is 6.`,
      type: AlertType.ABSENCE_THRESHOLD,
      priority: AlertPriority.HIGH,
      studentId,
      targetRole: 'admin',
      module,
    });
  }

  // Get unread count
  async getUnreadCount(targetRole: string): Promise<number> {
    return this.alertRepository.count({
      where: { targetRole, status: AlertStatus.UNREAD },
    });
  }
}