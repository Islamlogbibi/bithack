import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            fullName: string;
            role: import("../entities").UserRole;
        };
    }>;
    me(req: {
        user: {
            userId: number;
            role: string;
            email: string;
        };
    }): {
        userId: number;
        role: string;
        email: string;
    };
}
export {};
