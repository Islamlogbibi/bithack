import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity, AssignmentSubmissionEntity } from '../entities';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly assignmentsRepo: Repository<AssignmentEntity>,
    @InjectRepository(AssignmentSubmissionEntity)
    private readonly submissionsRepo: Repository<AssignmentSubmissionEntity>,
  ) {}

  async list(groups?: string[]) {
    const qb = this.assignmentsRepo.createQueryBuilder('a');
    if (groups && groups.length > 0) {
      // Find assignments where at least one target group matches
      qb.where('a.targetGroupsJson ?| :groups', { groups });
    }
    return qb.orderBy('a.deadline', 'ASC').getMany();
  }

  async findByTeacher(teacherName: string) {
    return this.assignmentsRepo.find({
      where: { teacherName },
      order: { createdAt: 'DESC' },
    });
  }

  async createAssignment(data: Partial<AssignmentEntity>) {
    return this.assignmentsRepo.save(this.assignmentsRepo.create(data));
  }

  async submitWork(data: {
    assignmentId: number;
    studentId: number;
    studentName: string;
    fileName: string;
    fileContent: string;
  }) {
    const assignment = await this.assignmentsRepo.findOneOrFail({ where: { id: data.assignmentId } });
    return this.submissionsRepo.save(
      this.submissionsRepo.create({
        assignment,
        studentId: data.studentId,
        studentName: data.studentName,
        fileName: data.fileName,
        fileContent: data.fileContent,
      }),
    );
  }

  async getSubmissions(assignmentId: number) {
    return this.submissionsRepo.find({
      where: { assignment: { id: assignmentId } },
      order: { submittedAt: 'DESC' },
    });
  }
}
