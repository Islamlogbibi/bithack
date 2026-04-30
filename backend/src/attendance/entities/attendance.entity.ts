import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  JUSTIFIED = 'justified',
  LATE = 'late',
}

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
  status: AttendanceStatus;

  @Column({ nullable: true })
  qrCode: string; // QR code used for check-in

  @Column({ nullable: true })
  scanTime: Date;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Student, student => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: string;

  @ManyToOne(() => Schedule, schedule => schedule.id)
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @Column()
  scheduleId: string;

  @CreateDateColumn()
  createdAt: Date;
}