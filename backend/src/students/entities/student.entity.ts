import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string; // Academic ID (e.g., "2021CS001")

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  parentPhone: string;

  @Column({ nullable: true })
  level: string; // e.g., "L1", "L2", "L3"

  @Column({ nullable: true })
  section: string; // e.g., "A", "B"

  @Column({ nullable: true })
  group: string; // e.g., "1", "2"

  @ManyToOne(() => Speciality, { nullable: true })
  @JoinColumn({ name: 'specialityId' })
  speciality: Speciality;

  @Column({ nullable: true })
  specialityId: string;

  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('specialities')
export class Speciality {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Computer Science", "Mathematics"

  @Column({ nullable: true })
  code: string; // e.g., "CS", "MATH"

  @Column({ nullable: true })
  department: string;

  @OneToMany(() => Student, student => student.speciality)
  students: Student[];
}