import { SpecialitiesService } from './specialities.service';
export declare class SpecialitiesController {
    private readonly specialitiesService;
    constructor(specialitiesService: SpecialitiesService);
    getTree(): Promise<any[]>;
}
