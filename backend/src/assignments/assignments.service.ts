import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AssignmentEntity, AssignmentSubmissionEntity } from '../entities';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepo: Repository<AssignmentEntity>,
    @InjectRepository(AssignmentSubmissionEntity)
    private readonly submissionRepo: Repository<AssignmentSubmissionEntity>,
  ) {}

  async list(groups?: string[]) {
    if (groups && groups.length > 0) {
      // In a real app we'd use a more complex query for JSON arrays, 
      // but for this demo we'll fetch and filter or use like
      return this.assignmentRepo.find({ order: { createdAt: 'DESC' } });
    }
    return this.assignmentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async listByTeacher(teacherName: string) {
    return this.assignmentRepo.find({ 
      where: { teacherName },
      order: { createdAt: 'DESC' }
    });
  }

  async create(data: any) {
    const assignment = this.assignmentRepo.create(data);
    return this.assignmentRepo.save(assignment);
  }

  async submit(data: any) {
    const assignment = await this.assignmentRepo.findOne({ where: { id: data.assignmentId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    const submission = this.submissionRepo.create({
      assignment,
      studentId: data.studentId,
      studentName: data.studentName,
      fileName: data.fileName,
      fileContent: data.fileContent,
    });
    return this.submissionRepo.save(submission);
  }

  async listSubmissions(assignmentId: number) {
    return this.submissionRepo.find({
      where: { assignment: { id: assignmentId } },
      order: { submittedAt: 'DESC' }
    });
  }
}
