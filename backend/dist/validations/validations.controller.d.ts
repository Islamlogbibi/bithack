import { ValidationsService } from './validations.service';
export declare class ValidationsController {
    private readonly validationsService;
    constructor(validationsService: ValidationsService);
    list(): Promise<import("../entities").ValidationEntity[]>;
    review(id: string, body: {
        status: 'approved' | 'rejected';
    }): Promise<import("typeorm").UpdateResult>;
}
