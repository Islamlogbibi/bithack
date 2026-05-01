import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  StudentEntity, 
  UserEntity, 
  GradeEntity, 
  PresenceEntity, 
  SpecialityEntity, 
  LevelEntity, 
  SectionEntity, 
  GroupEntity 
} from '../entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(GradeEntity)
    private readonly gradeRepo: Repository<GradeEntity>,
    @InjectRepository(PresenceEntity)
    private readonly presenceRepo: Repository<PresenceEntity>,
    @InjectRepository(SpecialityEntity)
    private readonly specRepo: Repository<SpecialityEntity>,
    @InjectRepository(LevelEntity)
    private readonly levelRepo: Repository<LevelEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionRepo: Repository<SectionEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepo: Repository<GroupEntity>,
  ) {}

  async list(filters: Record<string, string | undefined>) {
    const qb = this.repo.createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.speciality', 'speciality')
      .leftJoinAndSelect('student.level', 'level')
      .leftJoinAndSelect('student.section', 'section')
      .leftJoinAndSelect('student.group', 'group');
    
    if (filters.query) {
      qb.andWhere('(LOWER(user.fullName) LIKE :q OR student.matricule LIKE :q)', {
        q: `%${filters.query.toLowerCase()}%`,
      });
    }
    if (filters.speciality) {
      const specialityId = Number(filters.speciality);
      if (Number.isFinite(specialityId)) {
        qb.andWhere('speciality.id = :specialityId', { specialityId });
      } else {
        qb.andWhere('(LOWER(speciality.libelle) = :specialityName OR LOWER(speciality.name) = :specialityName)', {
          specialityName: filters.speciality.toLowerCase(),
        });
      }
    }
    if (filters.level) {
      const levelId = Number(filters.level);
      if (Number.isFinite(levelId)) {
        qb.andWhere('level.id = :levelId', { levelId });
      } else {
        qb.andWhere('LOWER(level.libelle) = :levelName', { levelName: filters.level.toLowerCase() });
      }
    }
    if (filters.section) {
      const sectionId = Number(filters.section);
      if (Number.isFinite(sectionId)) {
        qb.andWhere('section.id = :sectionId', { sectionId });
      } else {
        qb.andWhere('LOWER(section.code) = :sectionCode', { sectionCode: filters.section.toLowerCase() });
      }
    }
    if (filters.group) {
      const groupId = Number(filters.group);
      if (Number.isFinite(groupId)) {
        qb.andWhere('group.id = :groupId', { groupId });
      } else {
        qb.andWhere('LOWER(group.code) = :groupCode', { groupCode: filters.group.toLowerCase() });
      }
    }

    return qb.getMany();
  }

  async findByUserId(userId: number) {
    return this.repo.findOne({ 
      where: { user: { id: userId } }, 
      relations: [
        'user', 
        'speciality', 
        'level', 
        'section', 
        'group', 
        'grades', 
        'grades.course', 
        'presences'
      ] 
    });
  }

  async create(payload: any) {
    const passwordHash = await bcrypt.hash(payload.password || 'password123', 10);
    const user = await this.usersRepo.save(
      this.usersRepo.create({
        fullName: payload.name,
        email: payload.email,
        passwordHash,
        role: 'student',
      }),
    );

    const speciality = await this.specRepo.findOne({ where: { id: payload.specialityId } });
    const level = await this.levelRepo.findOne({ where: { id: payload.levelId } });
    const section = await this.sectionRepo.findOne({ where: { id: payload.sectionId } });
    const group = await this.groupRepo.findOne({ where: { id: payload.groupId } });

    return this.repo.save(
      this.repo.create({
        user,
        matricule: payload.matricule,
        speciality,
        level,
        section,
        group,
      }),
    );
  }

  async remove(id: number) {
    const student = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!student) throw new NotFoundException('Student not found');
    await this.repo.delete(id);
    await this.usersRepo.delete(student.user.id);
    return { success: true };
  }
}
