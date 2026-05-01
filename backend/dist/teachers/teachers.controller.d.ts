import { TeachersService } from './teachers.service';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    list(): Promise<import("../entities").TeacherEntity[]>;
    update(id: string, data: {
        subjectsJson?: string[];
        groupsJson?: string[];
    }): Promise<import("../entities").TeacherEntity | null>;
}
