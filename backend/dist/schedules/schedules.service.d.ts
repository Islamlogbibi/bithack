import { OnModuleInit } from '@nestjs/common';
import { ScheduleEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class SchedulesService implements OnModuleInit {
    private readonly repo;
    constructor(repo: Repository<ScheduleEntity>);
    onModuleInit(): Promise<void>;
    byScope(scope: string, scopeId: string): Promise<ScheduleEntity[]>;
    listAll(): Promise<ScheduleEntity[]>;
    create(data: any): Promise<ScheduleEntity[]>;
    delete(id: number): Promise<import("typeorm").DeleteResult>;
}
