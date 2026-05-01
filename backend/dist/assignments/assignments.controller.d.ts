import { AssignmentsService } from './assignments.service';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    list(groups?: string): Promise<import("../entities").AssignmentEntity[]>;
    findByTeacher(name: string): Promise<import("../entities").AssignmentEntity[]>;
    create(body: any): Promise<import("../entities").AssignmentEntity>;
    submit(body: any): Promise<import("../entities").AssignmentSubmissionEntity>;
    getSubmissions(id: string): Promise<import("../entities").AssignmentSubmissionEntity[]>;
}
