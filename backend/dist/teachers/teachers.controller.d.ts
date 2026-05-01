import { TeachersService } from './teachers.service';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    list(): Promise<{
        id: number;
        name: any;
        email: any;
        department: any;
        hoursPlanned: number;
        hoursCompleted: number;
        subjects: any[];
        groups: any[];
        academicCv: any;
    }[]>;
    update(id: string, data: {
        subjectsJson?: string[];
        groupsJson?: string[];
    }): Promise<import("../entities").TeacherEntity | undefined>;
}
