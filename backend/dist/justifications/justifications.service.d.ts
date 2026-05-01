import { Repository } from 'typeorm';
import { JustificationEntity, StudentEntity } from '../entities';
export declare class JustificationsService {
    private readonly repo;
    private readonly studentRepo;
    constructor(repo: Repository<JustificationEntity>, studentRepo: Repository<StudentEntity>);
    list(): Promise<JustificationEntity[]>;
    create(data: any): Promise<JustificationEntity[]>;
    review(id: number, data: {
        status: 'approved' | 'rejected';
        reviewComment?: string;
    }): Promise<JustificationEntity>;
}
