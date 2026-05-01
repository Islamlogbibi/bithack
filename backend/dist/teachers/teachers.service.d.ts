import { Repository } from 'typeorm';
import { TeacherEntity, TeacherModuleEntity } from '../entities';
export declare class TeachersService {
    private readonly repo;
    private readonly moduleRepo;
    constructor(repo: Repository<TeacherEntity>, moduleRepo: Repository<TeacherModuleEntity>);
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
    findByUserId(userId: number): Promise<TeacherEntity | null>;
    update(id: number, data: any): Promise<TeacherEntity | undefined>;
}
