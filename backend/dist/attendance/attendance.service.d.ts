import { OnModuleInit } from '@nestjs/common';
import { AttendanceAlertEntity, StudentEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class AttendanceService implements OnModuleInit {
    private readonly repo;
    private readonly studentsRepo;
    private readonly usersRepo;
    constructor(repo: Repository<AttendanceAlertEntity>, studentsRepo: Repository<StudentEntity>, usersRepo: Repository<UserEntity>);
    onModuleInit(): Promise<void>;
    alerts(): Promise<AttendanceAlertEntity[]>;
    dismiss(id: number): Promise<import("typeorm").UpdateResult>;
}
