import { OnModuleInit } from '@nestjs/common';
import { AttendanceAlertEntity, StudentEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class AttendanceService implements OnModuleInit {
    private readonly repo;
    private readonly studentsRepo;
    constructor(repo: Repository<AttendanceAlertEntity>, studentsRepo: Repository<StudentEntity>);
    onModuleInit(): Promise<void>;
    alerts(): Promise<AttendanceAlertEntity[]>;
    dismiss(id: number): Promise<import("typeorm").UpdateResult>;
}
