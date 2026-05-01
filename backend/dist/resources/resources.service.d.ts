import { OnModuleInit } from '@nestjs/common';
import { ResourceEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class ResourcesService implements OnModuleInit {
    private readonly resourceRepo;
    constructor(resourceRepo: Repository<ResourceEntity>);
    onModuleInit(): Promise<void>;
    list(): Promise<ResourceEntity[]>;
    create(payload: Partial<ResourceEntity>): Promise<ResourceEntity>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
