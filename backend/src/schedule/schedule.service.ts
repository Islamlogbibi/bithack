import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, SessionType } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: ['teacher'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });
    
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    
    return schedule;
  }

  async findByTeacher(teacherId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { teacherId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByLevel(level: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { level },
      relations: ['teacher'],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findByDay(dayOfWeek: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { dayOfWeek },
      relations: ['teacher'],
      order: { startTime: 'ASC' },
    });
  }

  async findByModule(module: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { module },
      relations: ['teacher'],
    });
  }

  async create(createData: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(createData);
    return this.scheduleRepository.save(schedule);
  }

  async update(id: string, updateData: Partial<Schedule>): Promise<Schedule> {
    await this.scheduleRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }

  // Get weekly schedule for a teacher
  async getTeacherWeeklySchedule(teacherId: string): Promise<any> {
    const schedules = await this.scheduleRepository.find({
      where: { teacherId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });

    const weeklySchedule: { [key: number]: Schedule[] } = {};
    for (let i = 0; i < 7; i++) {
      weeklySchedule[i] = [];
    }

    for (const schedule of schedules) {
      weeklySchedule[schedule.dayOfWeek].push(schedule);
    }

    return weeklySchedule;
  }

  // Get schedule for a specific level and section
  async getLevelSchedule(level: string, section?: string, group?: string): Promise<Schedule[]> {
    const query = this.scheduleRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.teacher', 'teacher')
      .where('schedule.level = :level', { level });

    if (section) {
      query.andWhere('schedule.section = :section', { section });
    }

    if (group) {
      query.andWhere('schedule.group = :group', { group });
    }

    return query.orderBy('schedule.dayOfWeek', 'ASC')
      .addOrderBy('schedule.startTime', 'ASC')
      .getMany();
  }
}