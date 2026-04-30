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
import { User } from '../../users/entities/user.entity';

export enum TeacherType {
  PROFESSOR = 'professor',
  MAITRE_CONF = 'maitre_conf',
  VACATAIRE = 'vacataire',
}

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacherId: string; // Academic ID

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  office: string;

  @Column({ type: 'enum', enum: TeacherType, default: TeacherType.VACATAIRE })
  type: TeacherType;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  speciality: string;

  @OneToOne(() => User, user => user.teacher)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}