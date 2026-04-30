import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StudentEntity, UserEntity } from '../entities';
export declare class StudentsService implements OnModuleInit {
    private readonly studentsRepo;
    private readonly usersRepo;
    constructor(studentsRepo: Repository<StudentEntity>, usersRepo: Repository<UserEntity>);
    onModuleInit(): Promise<void>;
    list(filters: Record<string, string | undefined>): Promise<StudentEntity[]>;
    create(payload: {
        name: string;
        email: string;
        password: string;
        matricule: string;
        speciality: string;
        level: string;
        section: string;
        group: string;
    }): Promise<StudentEntity>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
