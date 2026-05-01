import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    getByScope(scope: string, scopeId: string): Promise<import("../entities").ScheduleEntity[]>;
    listAll(): Promise<import("../entities").ScheduleEntity[]>;
    create(body: any): Promise<import("../entities").ScheduleEntity[]>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
