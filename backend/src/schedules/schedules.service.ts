import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity, TeacherEntity } from '../entities';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly repo: Repository<ScheduleEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
  ) {}

  async list() {
    return this.repo.find({ relations: ['teacher', 'teacher.user'] });
  }

  async getByScope(scope: string, scopeId: string) {
    if (scope === 'group') {
      return this.repo.find({ 
        where: { groupName: scopeId },
        relations: ['teacher', 'teacher.user'],
        order: { day: 'ASC', timeSlot: 'ASC' }
      });
    }
    if (scope === 'teacher') {
      return this.repo.find({ 
        where: { teacher: { id: Number(scopeId) } },
        relations: ['teacher', 'teacher.user'],
        order: { day: 'ASC', timeSlot: 'ASC' }
      });
    }
    return [];
  }

  async create(data: any) {
    const teacher = await this.teacherRepo.findOne({ where: { id: data.teacherId } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    
    const schedule = this.repo.create({
      day: data.day,
      timeSlot: data.time,
      subject: data.subject,
      sessionType: data.type,
      room: data.room,
      teacher: teacher,
      groupName: data.group,
    });

    try {
      return await this.repo.save(schedule);
    } catch (e) {
      if (e.code === '23505') { 
        throw new ConflictException('Conflit d\'emploi du temps : Salle, Enseignant ou Groupe déjà occupé à ce créneau.');
      }
      throw e;
    }
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
