import { OnModuleInit } from '@nestjs/common';
import { ValidationEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class ValidationsService implements OnModuleInit {
    private readonly repo;
    constructor(repo: Repository<ValidationEntity>);
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
    review(id: number, status: 'approved' | 'rejected'): Promise<import("typeorm").UpdateResult>;
}
