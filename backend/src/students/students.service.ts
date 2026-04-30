import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student, Speciality } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Speciality)
    private specialityRepository: Repository<Speciality>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      relations: ['user', 'speciality'],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'speciality'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    
    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['user', 'speciality'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with user ID ${userId} not found`);
    }
    
    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentId },
      relations: ['user', 'speciality'],
    });
    
    if (!student) {
      throw new NotFoundException(`Student with student ID ${studentId} not found`);
    }
    
    return student;
  }

  async update(id: string, updateData: Partial<Student>): Promise<Student> {
    await this.studentRepository.update(id, updateData);
    return this.findOne(id);
  }

  // Speciality methods
  async findAllSpecialities(): Promise<Speciality[]> {
    return this.specialityRepository.find();
  }

  async createSpeciality(data: Partial<Speciality>): Promise<Speciality> {
    const speciality = this.specialityRepository.create(data);
    return this.specialityRepository.save(speciality);
  }
}