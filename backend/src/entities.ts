import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export type UserRole = 'admin' | 'student' | 'teacher' | 'dean';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  passwordHash: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  faculty: string;

  @Column({ type: 'jsonb', nullable: true })
  adminStatsJson: any;

  @OneToOne('StudentEntity', 'user', { cascade: true })
  student?: any;

  @OneToOne('TeacherEntity', 'user', { cascade: true })
  teacher?: any;
}

@Entity('departments')
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  libelle: string;

  @Column({ unique: true })
  code: string;

  @OneToMany('SpecialityEntity', 'department')
  specialities: any[];

  @OneToMany('TeacherEntity', 'department')
  teachers: any[];

  @ManyToOne('TeacherEntity')
  @JoinColumn()
  chef: any;
}

@Entity('specialities')
export class SpecialityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  libelle: string;

  @ManyToOne('DepartmentEntity', 'specialities')
  department: any;

  @OneToMany('LevelEntity', 'speciality')
  levels: any[];
}

@Entity('levels')
export class LevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  libelle: string;

  @ManyToOne('SpecialityEntity', 'levels')
  speciality: any;

  @OneToMany('SectionEntity', 'level')
  sections: any[];
}

@Entity('sections')
export class SectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @ManyToOne('LevelEntity', 'sections')
  level: any;

  @OneToMany('GroupEntity', 'section')
  groups: any[];
}

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  type: string; // 'TD', 'TP', etc.

  @ManyToOne('SectionEntity', 'groups')
  section: any;
}

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne('UserEntity', 'student')
  @JoinColumn()
  user: any;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ unique: true })
  numCarte: string;

  @ManyToOne('SpecialityEntity')
  speciality: any;

  @ManyToOne('LevelEntity')
  level: any;

  @ManyToOne('SectionEntity')
  section: any;

  @ManyToOne('GroupEntity')
  group: any;

  @Column({ type: 'float', default: 0 })
  average: number;

  @OneToMany('GradeEntity', 'student')
  grades: any[];

  @OneToMany('PresenceEntity', 'student')
  presences: any[];
}

@Entity('teachers')
export class TeacherEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne('UserEntity', 'teacher')
  @JoinColumn()
  user: any;

  @ManyToOne('DepartmentEntity', 'teachers')
  department: any;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ nullable: true })
  orcid: string;

  @Column({ nullable: true })
  scopusId: string;

  @OneToMany('CourseEntity', 'teacher')
  courses: any[];

  @OneToOne('CVAcademiqueEntity', 'teacher')
  cv: any;
}

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intitule: string;

  @Column()
  codeCours: string;

  @Column()
  credits: number;

  @Column()
  type: string; // 'Cours', 'TD', 'TP'

  @ManyToOne('TeacherEntity', 'courses')
  teacher: any;

  @ManyToOne('SpecialityEntity')
  speciality: any;

  @ManyToOne('LevelEntity')
  level: any;
}

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  dateSeance: Date;

  @Column({ type: 'time' })
  heureDebut: string;

  @Column({ type: 'time' })
  heureFin: string;

  @Column()
  salle: string;

  @Column({ nullable: true })
  codeQr: string;

  @ManyToOne('CourseEntity')
  course: any;

  @ManyToOne('SectionEntity')
  section: any;

  @ManyToOne('GroupEntity')
  group: any;

  @ManyToOne('LevelEntity')
  level: any;

  @ManyToOne('SpecialityEntity')
  speciality: any;
}

@Entity('grades')
export class GradeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  valeur: number;

  @Column()
  session: string; // 'Normal', 'Rattrapage'

  @Column()
  statut: string; // 'Saisi', 'Valide', 'Rejete'

  @CreateDateColumn()
  dateSaisie: Date;

  @Column({ nullable: true })
  dateValidation: Date;

  @ManyToOne('StudentEntity', 'grades')
  student: any;

  @ManyToOne('CourseEntity')
  course: any;

  @ManyToOne('TeacherEntity')
  teacher: any;

  @ManyToOne('ValidationEntity', 'grades', { nullable: true })
  validation: any;
}

@Entity('presences')
export class PresenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  horodatage: Date;

  @Column()
  methode: string; // 'QR', 'Manuel'

  @ManyToOne('StudentEntity', 'presences')
  student: any;

  @ManyToOne('ScheduleEntity')
  schedule: any;
}

@Entity('cv_academique')
export class CVAcademiqueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orcid: string;

  @UpdateDateColumn()
  dateSync: Date;

  @OneToOne('TeacherEntity', 'cv')
  @JoinColumn()
  teacher: any;
}

@Entity('teacher_speciality')
export class TeacherSpecialityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('TeacherEntity')
  teacher: any;

  @ManyToOne('SpecialityEntity')
  speciality: any;

  @ManyToOne('LevelEntity')
  level: any;
}

@Entity('validations')
export class ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('TeacherEntity')
  teacher: any;

  @ManyToOne('CourseEntity')
  course: any;

  @ManyToOne('GroupEntity')
  group: any;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  submittedAt: Date;

  @OneToMany('GradeEntity', 'validation')
  grades: any[];
}

@Entity('resources')
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne('CourseEntity')
  course: any;

  @Column()
  type: string;

  @Column()
  date: string;

  @Column()
  size: string;

  @Column()
  url: string;

  @ManyToOne('GroupEntity')
  group: any;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('justifications')
export class JustificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('StudentEntity')
  student: any;

  @ManyToOne('CourseEntity')
  course: any;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column()
  fileName: string;

  @Column({ type: 'text', nullable: true })
  fileContent: string;

  @Column({ nullable: true })
  absenceDate: string;

  @Column({ nullable: true })
  reviewComment: string;

  @CreateDateColumn()
  submittedAt: Date;
}

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: string;

  @ManyToOne('UserEntity')
  sender: any;

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}

@Entity('attendance_alerts')
export class AttendanceAlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('StudentEntity')
  student: any;

  @ManyToOne('CourseEntity')
  course: any;

  @Column()
  absences: number;

  @Column()
  severity: 'low' | 'medium' | 'high';

  @Column({ default: false })
  dismissed: boolean;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('reference_blobs')
export class ReferenceBlobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  data: any;
}

@Entity('assignments')
export class AssignmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne('CourseEntity')
  course: any;

  @Column()
  dueDate: string;

  @Column()
  description: string;

  @ManyToMany('GroupEntity')
  @JoinTable()
  groups: any[];

  @ManyToOne('TeacherEntity')
  teacher: any;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('assignment_submissions')
export class AssignmentSubmissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('AssignmentEntity')
  assignment: any;

  @ManyToOne('StudentEntity')
  student: any;

  @Column()
  fileName: string;

  @Column({ type: 'text' })
  fileContent: string;

  @CreateDateColumn()
  submittedAt: Date;
}
