import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dean } from '../admin/entities/admin.entity';

@Injectable()
export class DeanService {
  constructor(
    @InjectRepository(Dean)
    private deanRepository: Repository<Dean>,
  ) {}

  async findAll(): Promise<Dean[]> {
    return this.deanRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Dean> {
    const dean = await this.deanRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!dean) {
      throw new NotFoundException(`Dean with ID ${id} not found`);
    }
    
    return dean;
  }

  async findByUserId(userId: string): Promise<Dean> {
    const dean = await this.deanRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!dean) {
      throw new NotFoundException(`Dean with user ID ${userId} not found`);
    }
    
    return dean;
  }
}