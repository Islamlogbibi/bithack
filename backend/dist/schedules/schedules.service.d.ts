import { Repository } from 'typeorm';
import { ScheduleEntity, TeacherEntity } from '../entities';
export declare class SchedulesService {
    private readonly repo;
    private readonly teacherRepo;
    constructor(repo: Repository<ScheduleEntity>, teacherRepo: Repository<TeacherEntity>);
    list(): Promise<ScheduleEntity[]>;
    getByScope(scope: string, scopeId: string): Promise<ScheduleEntity[]>;
    create(data: any): Promise<ScheduleEntity[]>;
    delete(id: number): Promise<import("typeorm").DeleteResult>;
}
