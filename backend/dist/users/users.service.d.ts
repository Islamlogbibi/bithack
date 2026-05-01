import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../entities';
export declare class UsersService {
    private readonly repo;
    constructor(repo: Repository<UserEntity>);
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: number): Promise<UserEntity | null>;
    create(data: {
        email: string;
        fullName: string;
        passwordHash: string;
        role: UserRole;
    }): Promise<UserEntity>;
}
