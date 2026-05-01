import { Repository } from 'typeorm';
import { AssignmentEntity, AssignmentSubmissionEntity } from '../entities';
export declare class AssignmentsService {
    private readonly assignmentsRepo;
    private readonly submissionsRepo;
    constructor(assignmentsRepo: Repository<AssignmentEntity>, submissionsRepo: Repository<AssignmentSubmissionEntity>);
    list(groups?: string[]): Promise<AssignmentEntity[]>;
    findByTeacher(teacherName: string): Promise<AssignmentEntity[]>;
    createAssignment(data: Partial<AssignmentEntity>): Promise<AssignmentEntity>;
    submitWork(data: {
        assignmentId: number;
        studentId: number;
        studentName: string;
        fileName: string;
        fileContent: string;
    }): Promise<AssignmentSubmissionEntity>;
    getSubmissions(assignmentId: number): Promise<AssignmentSubmissionEntity[]>;
}
