import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';

export enum SessionType {
  CM = 'cm', // Cours magistral
  TD = 'td', // Travaux dirigés
  TP = 'tp', // Travaux pratiques
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  module: string; // Module/Course name

  @Column({ nullable: true })
  moduleCode: string;

  @Column({ type: 'enum', enum: SessionType, default: SessionType.CM })
  sessionType: SessionType;

  @Column()
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.

  @Column()
  startTime: string; // "08:30"

  @Column()
  endTime: string; // "10:30"

  @Column({ nullable: true })
  room: string;

  @Column({ nullable: true })
  building: string;

  @ManyToOne(() => Teacher, teacher => teacher.id)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column()
  teacherId: string;

  @Column({ nullable: true })
  level: string; // "L1", "L2", "L3"

  @Column({ nullable: true })
  section: string; // "A", "B"

  @Column({ nullable: true })
  group: string; // "1", "2"

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}