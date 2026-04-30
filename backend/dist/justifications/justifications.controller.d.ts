import { JustificationsService } from './justifications.service';
export declare class JustificationsController {
    private readonly justificationsService;
    constructor(justificationsService: JustificationsService);
    list(): Promise<import("../entities").JustificationEntity[]>;
    create(body: {
        studentId: number;
        module: string;
        fileName: string;
    }): Promise<import("../entities").JustificationEntity>;
    review(id: string, body: {
        status: 'approved' | 'rejected';
        reviewComment?: string;
    }): Promise<import("../entities").JustificationEntity>;
}
