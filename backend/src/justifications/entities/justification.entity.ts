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

export enum JustificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('justifications')
export class Justification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date; // Date of absence

  @Column()
  session: string; // "08:00-10:00 CM"

  @Column({ type: 'text' })
  reason: string;

  @Column({ nullable: true })
  documentPath: string; // Path to uploaded document

  @Column({ type: 'enum', enum: JustificationStatus, default: JustificationStatus.PENDING })
  status: JustificationStatus;

  @Column({ nullable: true })
  adminComment: string;

  @ManyToOne(() => Student, student => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column()
  studentId: string;

  @Column({ nullable: true })
  reviewedBy: string; // Admin ID who reviewed

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}