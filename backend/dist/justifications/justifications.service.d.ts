import { JustificationEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class JustificationsService {
    private readonly justificationsRepo;
    private readonly studentsRepo;
    constructor(justificationsRepo: Repository<JustificationEntity>, studentsRepo: Repository<StudentEntity>);
    list(): Promise<JustificationEntity[]>;
    create(studentId: number, module: string, fileName: string): Promise<JustificationEntity>;
    review(id: number, status: 'approved' | 'rejected', reviewComment?: string): Promise<JustificationEntity>;
}
