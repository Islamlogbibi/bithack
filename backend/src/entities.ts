import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
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

  @Column({ type: 'varchar', nullable: true })
  department: string | null;

  @Column({ type: 'varchar', nullable: true })
  faculty: string | null;

  @Column({ type: 'jsonb', nullable: true })
  adminStatsJson: Record<string, number> | null;

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

  @Column({ type: 'varchar', nullable: true })
  yearLabel: string | null;

  @Column({ type: 'jsonb', nullable: true })
  gradesJson: unknown[] | null;

  @Column({ type: 'jsonb', nullable: true })
  absencesByModuleJson: Record<string, number> | null;

  @Column({ type: 'jsonb', nullable: true })
  notesJson: number[] | null;

  @Column({ type: 'jsonb', nullable: true })
  gpaByPeriodJson: { year: string; semester: string; gpa: number }[] | null;

  @Column({ type: 'varchar', nullable: true })
  displayFaculty: string | null;

  @Column({ type: 'varchar', nullable: true })
  displayDepartment: string | null;

  @Column({ type: 'varchar', nullable: true })
  displayModule: string | null;
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

  @Column({ type: 'jsonb', nullable: true })
  subjectsJson: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  groupsJson: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  pendingGradesJson: unknown[] | null;

  @Column({ type: 'jsonb', nullable: true })
  academicCvJson: { 
    orcid?: string; 
    scopus?: string; 
    publications: { title: string; year: number; journal: string }[] 
  } | null;
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

  @Column({ type: 'varchar', nullable: true })
  sizeLabel: string | null;

  @Column({ default: false })
  isNew: boolean;

  @Column({ type: 'text', nullable: true })
  fileContent: string | null;

  @Column({ type: 'jsonb', nullable: true })
  groupsJson: string[] | null;

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

  @Column({ nullable: true })
  absenceDate: string;

  @Column({ nullable: true })
  absenceDay: string;

  @Column({ nullable: true })
  absenceTime: string;

  @Column()
  fileName: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'varchar', nullable: true })
  reviewComment: string | null;

  @Column({ type: 'text', nullable: true })
  fileContent: string | null;

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

  @Column({ type: 'varchar', nullable: true })
  speciality: string | null;

  @Column({ type: 'varchar', nullable: true })
  level: string | null;

  @Column({ type: 'varchar', nullable: true })
  section: string | null;

  @Column({ type: 'int', default: 0 })
  slaHours: number;

  @Column({ type: 'jsonb', nullable: true })
  studentGradesJson: { student: string; matricule: string; grade: number }[] | null;

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

  @Column({ type: 'int', nullable: true })
  absenceCount: number | null;

  @Column({ type: 'int', nullable: true })
  maxAllowed: number | null;
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
@Unique(['name', 'level', 'section', 'groupName'])
export class SpecialityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

@Entity('reference_blobs')
export class ReferenceBlobEntity {
  @PrimaryColumn()
  key: string;

  @Column({ type: 'jsonb' })
  data: unknown;
}

@Entity('assignments')
export class AssignmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  module: string;

  @Column()
  teacherName: string;

  @Column({ type: 'jsonb' })
  targetGroupsJson: string[];

  @Column()
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('assignment_submissions')
export class AssignmentSubmissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AssignmentEntity)
  assignment: AssignmentEntity;

  @Column()
  studentId: number;

  @Column()
  studentName: string;

  @Column()
  fileName: string;

  @Column({ type: 'text' })
  fileContent: string;

  @CreateDateColumn()
  submittedAt: Date;
}
