import { OnModuleInit } from '@nestjs/common';
import { ValidationEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class ValidationsService implements OnModuleInit {
    private readonly repo;
    private readonly studentRepo;
    constructor(repo: Repository<ValidationEntity>, studentRepo: Repository<StudentEntity>);
    onModuleInit(): Promise<void>;
    list(): Promise<ValidationEntity[]>;
    create(data: {
        teacherName: string;
        module: string;
        groupName: string;
        count: number;
        slaHours?: number;
        studentGradesJson?: {
            student: string;
            matricule: string;
            grade: number;
        }[];
    }): Promise<ValidationEntity>;
    review(id: number, status: 'approved' | 'rejected'): Promise<import("typeorm").UpdateResult | undefined>;
}
