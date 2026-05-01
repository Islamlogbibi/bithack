import { ValidationsService } from './validations.service';
export declare class ValidationsController {
    private readonly validationsService;
    constructor(validationsService: ValidationsService);
    list(): Promise<{
        id: number;
        teacherName: any;
        module: string;
        groupName: string;
        status: "pending" | "approved" | "rejected";
        count: number;
        submittedAt: Date;
        studentGradesJson: {
            matricule: any;
            grade: any;
            td: any;
        }[];
    }[]>;
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
    }): Promise<{
        success: boolean;
    }>;
}
