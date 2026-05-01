import { TeachersService } from './teachers.service';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    list(): Promise<{
        id: number;
        name: any;
        email: any;
        department: any;
        hoursPlanned: any;
        hoursCompleted: any;
        subjects: unknown[];
        groups: unknown[];
        academicCv: any;
    }[]>;
    update(id: string, data: {
        subjectsJson?: string[];
        groupsJson?: string[];
    }): Promise<import("../entities").TeacherEntity | undefined>;
}
