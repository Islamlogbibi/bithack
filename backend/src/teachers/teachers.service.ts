import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherEntity, TeacherModuleEntity } from '../entities';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly repo: Repository<TeacherEntity>,
    @InjectRepository(TeacherModuleEntity)
    private readonly moduleRepo: Repository<TeacherModuleEntity>,
  ) {}

  async list() {
    const teachers = await this.repo.find({ relations: ['user', 'modules'] });
    return teachers.map(t => ({
      id: t.id,
      name: t.user.fullName,
      email: t.user.email,
      department: t.department,
      hoursPlanned: t.hoursPlanned,
      hoursCompleted: t.hoursCompleted,
      subjects: [...new Set(t.modules?.map(m => m.subject) || [])],
      groups: [...new Set(t.modules?.map(m => m.groupName) || [])],
      academicCv: t.academicCvJson,
    }));
  }

  async findByUserId(userId: number) {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'modules'],
    });
  }

  async update(id: number, data: any) {
    const teacher = await this.repo.findOne({ where: { id }, relations: ['modules'] });
    if (!teacher) return;

    if (data.department !== undefined) teacher.department = data.department;
    if (data.hoursPlanned !== undefined) teacher.hoursPlanned = data.hoursPlanned;
    
    if (data.subjects !== undefined || data.groups !== undefined) {
      // For simplicity in this demo, if subjects or groups are provided, 
      // we rebuild the module list. In a real app, this would be more granular.
      const subjects = data.subjects || [...new Set(teacher.modules?.map(m => m.subject) || [])];
      const groups = data.groups || [...new Set(teacher.modules?.map(m => m.groupName) || [])];
      
      await this.moduleRepo.delete({ teacher: { id: teacher.id } });
      for (const s of subjects) {
        for (const g of groups) {
          await this.moduleRepo.save(this.moduleRepo.create({
            teacher,
            subject: s,
            groupName: g
          }));
        }
      }
    }

    return this.repo.save(teacher);
  }
}
