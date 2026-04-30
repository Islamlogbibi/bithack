import { OnModuleInit } from '@nestjs/common';
import { SpecialityEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class SpecialitiesService implements OnModuleInit {
    private readonly repo;
    constructor(repo: Repository<SpecialityEntity>);
    onModuleInit(): Promise<void>;
    list(): Promise<SpecialityEntity[]>;
}
