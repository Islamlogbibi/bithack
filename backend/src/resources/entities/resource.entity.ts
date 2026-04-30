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

export enum ResourceType {
  PDF = 'pdf',
  VIDEO = 'video',
  LINK = 'link',
  DOCUMENT = 'document',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ResourceType, default: ResourceType.DOCUMENT })
  type: ResourceType;

  @Column()
  url: string; // File URL or external link

  @Column({ nullable: true })
  module: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  section: string;

  @ManyToOne(() => Teacher, teacher => teacher.id)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column({ nullable: true })
  teacherId: string;

  @Column({ default: true })
  isPublic: boolean; // Visible to all students

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}