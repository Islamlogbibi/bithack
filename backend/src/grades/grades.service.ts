import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade, GradeStatus, GradeType } from './entities/grade.entity';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
  ) {}

  async findAll(): Promise<Grade[]> {
    return this.gradeRepository.find({
      relations: ['student', 'teacher'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentId: string): Promise<Grade[]> {
    return this.gradeRepository.find({
      where: { studentId },
      relations: ['teacher'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTeacher(teacherId: string): Promise<Grade[]> {
    return this.gradeRepository.find({
      where: { teacherId },
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByModule(module: string): Promise<Grade[]> {
    return this.gradeRepository.find({
      where: { module },
      relations: ['student', 'teacher'],
    });
  }

  async findOne(id: string): Promise<Grade> {
    const grade = await this.gradeRepository.findOne({
      where: { id },
      relations: ['student', 'teacher'],
    });
    
    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }
    
    return grade;
  }

  async create(createData: Partial<Grade>): Promise<Grade> {
    const grade = this.gradeRepository.create({
      ...createData,
      status: GradeStatus.PENDING,
    });
    return this.gradeRepository.save(grade);
  }

  async update(id: string, updateData: Partial<Grade>): Promise<Grade> {
    await this.gradeRepository.update(id, updateData);
    return this.findOne(id);
  }

  async validateGrade(id: string): Promise<Grade> {
    const grade = await this.findOne(id);
    grade.status = GradeStatus.VALIDATED;
    return this.gradeRepository.save(grade);
  }

  async rejectGrade(id: string): Promise<Grade> {
    const grade = await this.findOne(id);
    grade.status = GradeStatus.REJECTED;
    return this.gradeRepository.save(grade);
  }

  // Calculate GPA for a student
  async calculateGPA(studentId: string): Promise<number> {
    const grades = await this.gradeRepository.find({
      where: { studentId, status: GradeStatus.VALIDATED },
    });

    if (grades.length === 0) {
      return 0;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const grade of grades) {
      const weight = grade.type === GradeType.TD ? 0.4 : 0.6;
      totalWeightedScore += grade.value * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  // Get pending grades for a teacher
  async getPendingGrades(teacherId: string): Promise<Grade[]> {
    return this.gradeRepository.find({
      where: { teacherId, status: GradeStatus.PENDING },
      relations: ['student'],
    });
  }

  // Get grades by semester
  async findBySemester(studentId: string, semester: string): Promise<Grade[]> {
    return this.gradeRepository.find({
      where: { studentId, semester },
      relations: ['teacher'],
    });
  }
}