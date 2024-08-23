import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
interface JwtUserData {
    userId: number;
    email: string;
}
declare module 'express' {
    interface Request {
        user: JwtUserData;
    }
}
export declare class AuthGuard implements CanActivate {
    private reflector;
    private jwtService;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
export {};
