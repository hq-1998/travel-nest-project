import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
export declare class UserController {
    private readonly userService;
    redisService: RedisService;
    emailService: EmailService;
    jwtService: JwtService;
    constructor(userService: UserService);
    register(registerUser: RegisterUserDto): Promise<{
        email: string;
        nickname: string;
        headPic: string;
        createTime: Date;
        id: number;
    }>;
    login(loginUser: LoginUserDto): Promise<LoginUserVo>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    captcha(address: string): Promise<string>;
}
