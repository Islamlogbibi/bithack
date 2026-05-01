import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    list(): Promise<import("../entities").ResourceEntity[]>;
    create(body: any): Promise<import("../entities").ResourceEntity[]>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
