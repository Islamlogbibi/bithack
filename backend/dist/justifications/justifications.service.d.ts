import { OnModuleInit } from '@nestjs/common';
import { JustificationEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class JustificationsService implements OnModuleInit {
    private readonly justificationsRepo;
    private readonly studentsRepo;
    constructor(justificationsRepo: Repository<JustificationEntity>, studentsRepo: Repository<StudentEntity>);
    onModuleInit(): Promise<void>;
    list(): Promise<JustificationEntity[]>;
    create(studentId: number, module: string, fileName: string, fileContent?: string, metadata?: {
        absenceDate: string;
        absenceDay: string;
        absenceTime: string;
    }): Promise<JustificationEntity>;
    review(id: number, status: 'approved' | 'rejected', reviewComment?: string): Promise<JustificationEntity>;
}
