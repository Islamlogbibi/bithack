import { OnModuleInit } from '@nestjs/common';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class UsersService implements OnModuleInit {
    private readonly usersRepo;
    constructor(usersRepo: Repository<UserEntity>);
    onModuleInit(): Promise<void>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: number): Promise<UserEntity | null>;
    private createSeedUser;
}
