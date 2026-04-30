import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export enum AlertType {
  ABSENCE_THRESHOLD = 'absence_threshold',
  GRADE_SUBMITTED = 'grade_submitted',
  SCHEDULE_CHANGE = 'schedule_change',
  VALIDATION_REQUIRED = 'validation_required',
  GENERAL = 'general',
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum AlertStatus {
  UNREAD = 'unread',
  READ = 'read',
  RESOLVED = 'resolved',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: AlertType, default: AlertType.GENERAL })
  type: AlertType;

  @Column({ type: 'enum', enum: AlertPriority, default: AlertPriority.MEDIUM })
  priority: AlertPriority;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.UNREAD })
  status: AlertStatus;

  @ManyToOne(() => Student, student => student.id, { nullable: true })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ nullable: true })
  studentId: string;

  @Column({ nullable: true })
  targetRole: string; // 'student', 'teacher', 'admin', 'dean'

  @Column({ nullable: true })
  module: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}