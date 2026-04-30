import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, Dean } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Dean)
    private deanRepository: Repository<Dean>,
  ) {}

  async findAllAdmins(): Promise<Admin[]> {
    return this.adminRepository.find({
      relations: ['user'],
    });
  }

  async findAdminByUserId(userId: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!admin) {
      throw new NotFoundException(`Admin with user ID ${userId} not found`);
    }
    
    return admin;
  }

  async findAllDeans(): Promise<Dean[]> {
    return this.deanRepository.find({
      relations: ['user'],
    });
  }

  async findDeanByUserId(userId: string): Promise<Dean> {
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