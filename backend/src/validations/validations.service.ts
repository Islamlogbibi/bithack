import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationEntity, GradeEntity, StudentEntity, TeacherEntity, UserEntity } from '../entities';

@Injectable()
export class ValidationsService {
  constructor(
    @InjectRepository(ValidationEntity)
    private readonly repo: Repository<ValidationEntity>,
    @InjectRepository(GradeEntity)
    private readonly gradeRepo: Repository<GradeEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async list() {
    const validations = await this.repo.find({ 
      relations: ['teacher', 'teacher.user', 'grades', 'grades.student'],
      order: { submittedAt: 'DESC' }
    });

    return validations.map(v => ({
      id: v.id,
      teacherName: v.teacher?.user?.fullName || 'Inconnu',
      module: v.subject,
      groupName: v.groupName,
      status: v.status,
      count: v.grades?.length || 0,
      submittedAt: v.submittedAt,
      studentGradesJson: v.grades?.map(g => ({
        matricule: g.student?.matricule,
        grade: g.examGrade,
        td: g.tdGrade
      }))
    }));
  }

  async create(data: any) {
    const teacher = await this.teacherRepo.findOne({ 
      where: { user: { fullName: data.teacherName } },
      relations: ['user']
    });
    if (!teacher) throw new NotFoundException('Teacher not found');

    const validation = await this.repo.save(
      this.repo.create({
        teacher,
        subject: data.module,
        groupName: data.groupName,
        status: 'pending',
      }),
    );

    if (data.studentGradesJson && Array.isArray(data.studentGradesJson)) {
      for (const entry of data.studentGradesJson) {
        const student = await this.studentRepo.findOne({ where: { matricule: entry.matricule } });
        if (student) {
          const grade = this.gradeRepo.create({
            student,
            validation,
            subject: data.module,
            tdGrade: entry.td || 10,
            examGrade: entry.grade || 10,
            finalGrade: Math.round(((entry.td || 10) * 0.4 + (entry.grade || 10) * 0.6) * 10) / 10,
            status: 'pending',
            credits: 3
          });
          await this.gradeRepo.save(grade);
        }
      }
    }

    return validation;
  }

  async review(id: number, status: 'approved' | 'rejected', reviewerId?: number) {
    const validation = await this.repo.findOne({ 
      where: { id },
      relations: ['grades', 'grades.student']
    });
    if (!validation) throw new NotFoundException('Validation not found');

    validation.status = status;
    validation.reviewedAt = new Date();
    if (reviewerId) {
      const reviewer = await this.userRepo.findOne({ where: { id: reviewerId } });
      if (reviewer) validation.reviewedBy = reviewer;
    }

    await this.repo.save(validation);

    if (validation.grades) {
      for (const grade of validation.grades) {
        grade.status = status;
        await this.gradeRepo.save(grade);
        if (status === 'approved' && grade.student) {
          await this.updateStudentAverage(grade.student.id);
        }
      }
    }

    return { success: true };
  }

  private async updateStudentAverage(studentId: number) {
    const approvedGrades = await this.gradeRepo.find({
      where: { student: { id: studentId }, status: 'approved' }
    });
    
    if (approvedGrades.length > 0) {
      const sum = approvedGrades.reduce((acc, g) => acc + Number(g.finalGrade), 0);
      const avg = sum / approvedGrades.length;
      await this.studentRepo.update(studentId, { average: Math.round(avg * 100) / 100 });
    }
  }
}
