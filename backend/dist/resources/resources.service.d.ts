import { Repository } from 'typeorm';
import { ResourceEntity } from '../entities';
export declare class ResourcesService {
    private readonly repo;
    constructor(repo: Repository<ResourceEntity>);
    list(): Promise<ResourceEntity[]>;
    create(data: any): Promise<ResourceEntity[]>;
    delete(id: number): Promise<import("typeorm").DeleteResult>;
}
