import { ResourceEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class ResourcesService {
    private readonly resourceRepo;
    constructor(resourceRepo: Repository<ResourceEntity>);
    list(): Promise<ResourceEntity[]>;
    create(payload: Partial<ResourceEntity>): Promise<ResourceEntity>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
