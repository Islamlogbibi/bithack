import { OnModuleInit } from '@nestjs/common';
import { ReferenceBlobEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class ReferenceService implements OnModuleInit {
    private readonly repo;
    constructor(repo: Repository<ReferenceBlobEntity>);
    onModuleInit(): Promise<void>;
    get(key: string): Promise<any>;
    save(key: string, data: any): Promise<any>;
}
