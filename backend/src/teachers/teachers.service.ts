import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    
    return teacher;
  }

  async findByUserId(userId: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!teacher) {
      throw new NotFoundException(`Teacher with user ID ${userId} not found`);
    }
    
    return teacher;
  }

  async findByTeacherId(teacherId: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { teacherId },
      relations: ['user'],
    });
    
    if (!teacher) {
      throw new NotFoundException(`Teacher with teacher ID ${teacherId} not found`);
    }
    
    return teacher;
  }

  async update(id: string, updateData: Partial<Teacher>): Promise<Teacher> {
    await this.teacherRepository.update(id, updateData);
    return this.findOne(id);
  }
}