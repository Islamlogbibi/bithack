import { Repository } from 'typeorm';
import { ValidationEntity, GradeEntity, StudentEntity, TeacherEntity, UserEntity } from '../entities';
export declare class ValidationsService {
    private readonly repo;
    private readonly gradeRepo;
    private readonly studentRepo;
    private readonly teacherRepo;
    private readonly userRepo;
    constructor(repo: Repository<ValidationEntity>, gradeRepo: Repository<GradeEntity>, studentRepo: Repository<StudentEntity>, teacherRepo: Repository<TeacherEntity>, userRepo: Repository<UserEntity>);
    list(): Promise<{
        id: number;
        teacherName: any;
        module: string;
        groupName: string;
        status: "pending" | "approved" | "rejected";
        count: any;
        submittedAt: Date;
        studentGradesJson: any[];
    }[]>;
    create(data: any): Promise<ValidationEntity>;
    review(id: number, status: 'approved' | 'rejected', reviewerId?: number): Promise<{
        success: boolean;
    }>;
    private updateStudentAverage;
}
