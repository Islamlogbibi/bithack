import { LevelEntity, SpecialityEntity } from '../entities';
import { Repository } from 'typeorm';
export declare class SpecialitiesService {
    private readonly repo;
    private readonly levelRepo;
    constructor(repo: Repository<SpecialityEntity>, levelRepo: Repository<LevelEntity>);
    list(): Promise<SpecialityEntity[]>;
    getTree(): Promise<any[]>;
}
