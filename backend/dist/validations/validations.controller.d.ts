import { ValidationsService } from './validations.service';
export declare class ValidationsController {
    private readonly validationsService;
    constructor(validationsService: ValidationsService);
    list(): Promise<import("../entities").ValidationEntity[]>;
    create(body: {
        teacherName: string;
        module: string;
        groupName: string;
        count: number;
        slaHours?: number;
        studentGradesJson?: {
            student: string;
            matricule: string;
            grade: number;
        }[];
    }): Promise<import("../entities").ValidationEntity>;
    review(id: string, body: {
        status: 'approved' | 'rejected';
    }): Promise<import("typeorm").UpdateResult>;
}
