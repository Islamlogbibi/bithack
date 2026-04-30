import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'student' | 'teacher' | 'admin' | 'dean';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column()
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;

  @Column({ unique: true })
  matricule: string;

  @Column()
  speciality: string;

  @Column()
  level: string;

  @Column()
  section: string;

  @Column()
  groupName: string;

  @Column({ type: 'float', default: 0 })
  average: number;

  @Column({ default: 0 })
  absences: number;
}

@Entity('teachers')
export class TeacherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;

  @Column()
  department: string;

  @Column({ type: 'int', default: 0 })
  hoursPlanned: number;

  @Column({ type: 'int', default: 0 })
  hoursCompleted: number;
}

@Entity('resources')
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  subject: string;

  @Column()
  type: string;

  @Column()
  fileType: string;

  @Column()
  teacherName: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('justifications')
export class JustificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentEntity, { eager: true })
  student: StudentEntity;

  @Column()
  module: string;

  @Column()
  fileName: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  reviewComment: string | null;

  @CreateDateColumn()
  submittedAt: Date;
}

@Entity('validations')
export class ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacherName: string;

  @Column()
  module: string;

  @Column()
  groupName: string;

  @Column({ type: 'int' })
  count: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  submittedAt: Date;
}

@Entity('attendance_alerts')
export class AttendanceAlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentEntity, { eager: true })
  student: StudentEntity;

  @Column()
  subject: string;

  @Column()
  risk: 'low' | 'medium' | 'high';

  @Column({ default: 'open' })
  status: 'open' | 'dismissed';
}

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: string;

  @ManyToOne(() => UserEntity, { eager: true })
  sender: UserEntity;

  @Column('text')
  content: string;

  @CreateDateColumn()
  sentAt: Date;
}

@Entity('specialities')
export class SpecialityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  level: string;

  @Column()
  section: string;

  @Column()
  groupName: string;
}

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  time: string;

  @Column()
  subject: string;

  @Column()
  room: string;

  @Column()
  type: string;

  @Column()
  scope: 'student' | 'group' | 'faculty';

  @Column()
  scopeId: string;
}

