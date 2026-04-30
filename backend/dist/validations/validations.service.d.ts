import { ValidationEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class ValidationsService {
    private readonly repo;
    constructor(repo: Repository<ValidationEntity>);
    list(): Promise<ValidationEntity[]>;
    review(id: number, status: 'approved' | 'rejected'): Promise<import("typeorm").UpdateResult>;
}
