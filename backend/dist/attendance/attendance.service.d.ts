import { Repository } from 'typeorm';
import { AttendanceAlertEntity, StudentEntity } from '../entities';
export declare class AttendanceService {
    private readonly alertRepo;
    private readonly studentRepo;
    constructor(alertRepo: Repository<AttendanceAlertEntity>, studentRepo: Repository<StudentEntity>);
    listAlerts(): Promise<AttendanceAlertEntity[]>;
    createAlert(data: {
        studentId: number;
        module: string;
        absences: number;
        severity: 'low' | 'medium' | 'high';
    }): Promise<AttendanceAlertEntity[]>;
    dismissAlert(id: number): Promise<import("typeorm").UpdateResult>;
}
