import { AttendanceService } from './attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    alerts(): Promise<import("../entities").AttendanceAlertEntity[]>;
    dismiss(id: string): Promise<import("typeorm").UpdateResult>;
}
