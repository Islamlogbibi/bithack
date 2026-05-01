import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    byScope(scope: string, scopeId: string): Promise<import("../entities").ScheduleEntity[]>;
    listAll(): Promise<import("../entities").ScheduleEntity[]>;
    create(data: any): Promise<import("../entities").ScheduleEntity[]>;
    delete(id: string): Promise<import("typeorm").DeleteResult>;
}
