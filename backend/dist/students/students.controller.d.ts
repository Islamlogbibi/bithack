import { StudentsService } from './students.service';
declare class CreateStudentDto {
    name: string;
    email: string;
    password: string;
    matricule: string;
    speciality: string;
    level: string;
    section: string;
    group: string;
}
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    list(query: Record<string, string | undefined>): Promise<import("../entities").StudentEntity[]>;
    create(body: CreateStudentDto): Promise<import("../entities").StudentEntity>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
export {};
