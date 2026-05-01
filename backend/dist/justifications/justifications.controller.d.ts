import { JustificationsService } from './justifications.service';
export declare class JustificationsController {
    private readonly justificationsService;
    constructor(justificationsService: JustificationsService);
    list(): Promise<import("../entities").JustificationEntity[]>;
    create(body: any): Promise<import("../entities").JustificationEntity[]>;
    review(id: string, body: any): Promise<import("../entities").JustificationEntity>;
}
