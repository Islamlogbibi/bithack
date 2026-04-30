import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['student', 'schedule'],
    });
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { studentId },
      relations: ['schedule'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySchedule(scheduleId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { scheduleId },
      relations: ['student'],
    });
  }

  async findByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        studentId,
        createdAt: Between(startDate, endDate),
      },
      relations: ['schedule'],
      order: { createdAt: 'DESC' },
    });
  }

  // Generate QR code for a schedule session
  async generateQRCode(scheduleId: string): Promise<string> {
    const qrCode = `OSCA-${scheduleId}-${uuidv4()}-${Date.now()}`;
    
    // Store the QR code temporarily (in real app, use Redis with TTL)
    return qrCode;
  }

  // Record attendance from QR scan
  async recordAttendance(
    studentId: string,
    scheduleId: string,
    qrCode: string,
  ): Promise<Attendance> {
    // Validate QR code (in real app, check against Redis cache)
    if (!qrCode.startsWith('OSCA-')) {
      throw new BadRequestException('Invalid QR code');
    }

    // Check if attendance already recorded
    const existing = await this.attendanceRepository.findOne({
      where: { studentId, scheduleId },
    });

    if (existing) {
      throw new BadRequestException('Attendance already recorded');
    }

    const attendance = this.attendanceRepository.create({
      studentId,
      scheduleId,
      qrCode,
      status: AttendanceStatus.PRESENT,
      scanTime: new Date(),
    });

    return this.attendanceRepository.save(attendance);
  }

  // Get attendance statistics for a student
  async getStudentStats(studentId: string): Promise<any> {
    const attendances = await this.attendanceRepository.find({
      where: { studentId },
    });

    const total = attendances.length;
    const present = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const absent = attendances.filter(a => a.status === AttendanceStatus.ABSENT).length;
    const justified = attendances.filter(a => a.status === AttendanceStatus.JUSTIFIED).length;
    const late = attendances.filter(a => a.status === AttendanceStatus.LATE).length;

    return {
      total,
      present,
      absent,
      justified,
      late,
      attendanceRate: total > 0 ? ((present + justified + late) / total) * 100 : 0,
    };
  }

  // Mark absence
  async markAbsence(scheduleId: string, studentId: string): Promise<Attendance> {
    const attendance = this.attendanceRepository.create({
      studentId,
      scheduleId,
      status: AttendanceStatus.ABSENT,
    });

    return this.attendanceRepository.save(attendance);
  }

  // Justify an absence
  async justifyAbsence(id: string, notes: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    attendance.status = AttendanceStatus.JUSTIFIED;
    attendance.notes = notes;

    return this.attendanceRepository.save(attendance);
  }
}