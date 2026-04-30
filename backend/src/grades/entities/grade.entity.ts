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
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum GradeType {
  TD = 'td',
  EXAM = 'exam',
  PROJECT = 'project',
  PARTICIPATION = 'participation',
}

export enum GradeStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
}

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  module: string; // Course/Module name

  @Column({ nullable: true })
  moduleCode: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number; // Grade value (0-20)

  @Column({ type: 'enum', enum: GradeType, default: GradeType.EXAM })
  type: GradeType;

  @Column({ type: 'enum', enum: GradeStatus, default: GradeStatus.PENDING })
  status: GradeStatus;

  @Column({ nullable: true })
  description: string; // e.g., "Midterm Exam", "TD1"

  @ManyToOne(() => Student, student => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: string;

  @ManyToOne(() => Teacher, teacher => teacher.id)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column()
  teacherId: string;

  @Column({ nullable: true })
  semester: string; // "S1", "S2"

  @Column({ nullable: true })
  academicYear: string; // "2024-2025"

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}