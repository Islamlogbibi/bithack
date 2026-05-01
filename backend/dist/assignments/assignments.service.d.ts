import { Repository } from 'typeorm';
import { AssignmentEntity, AssignmentSubmissionEntity } from '../entities';
export declare class AssignmentsService {
    private readonly assignmentRepo;
    private readonly submissionRepo;
    constructor(assignmentRepo: Repository<AssignmentEntity>, submissionRepo: Repository<AssignmentSubmissionEntity>);
    list(groups?: string[]): Promise<AssignmentEntity[]>;
    listByTeacher(teacherName: string): Promise<AssignmentEntity[]>;
    create(data: any): Promise<AssignmentEntity[]>;
    submit(data: any): Promise<AssignmentSubmissionEntity>;
    listSubmissions(assignmentId: number): Promise<AssignmentSubmissionEntity[]>;
}
