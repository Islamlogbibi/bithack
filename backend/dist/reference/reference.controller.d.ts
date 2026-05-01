import { ReferenceService } from './reference.service';
export declare class ReferenceController {
    private readonly referenceService;
    constructor(referenceService: ReferenceService);
    one(key: string): Promise<any>;
    save(key: string, body: any): Promise<any>;
}
