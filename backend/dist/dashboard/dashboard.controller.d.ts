import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    student(): {
        message: string;
        stats: {};
    };
    teacher(): {
        message: string;
        stats: {};
    };
    admin(): {
        message: string;
        stats: {};
    };
    dean(): {
        message: string;
        stats: {};
    };
}
