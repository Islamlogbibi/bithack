import { TeacherEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class TeachersService {
    private readonly teachersRepo;
    constructor(teachersRepo: Repository<TeacherEntity>);
    list(): Promise<TeacherEntity[]>;
}
