import { OnModuleInit } from '@nestjs/common';
import { TeacherEntity, UserEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class TeachersService implements OnModuleInit {
    private readonly teachersRepo;
    private readonly usersRepo;
    constructor(teachersRepo: Repository<TeacherEntity>, usersRepo: Repository<UserEntity>);
    onModuleInit(): Promise<void>;
    list(): Promise<TeacherEntity[]>;
    findByUserId(userId: number): Promise<TeacherEntity | null>;
}
