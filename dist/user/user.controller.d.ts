import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdatePasswordUserDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user-dto';
export declare class UserController {
    private readonly userService;
    redisService: RedisService;
    emailService: EmailService;
    jwtService: JwtService;
    constructor(userService: UserService);
    register(registerUser: RegisterUserDto): Promise<LoginUserVo>;
    login(loginUser: LoginUserDto): Promise<LoginUserVo>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    info(userId: number, id: number): Promise<{
        id: number;
        email: string;
        address: string;
        nickname: string;
        headPic: string;
        createTime: Date;
    }>;
    update(userId: number, updateUserDto: UpdateUserDto): Promise<string>;
    updatePassword(passwordDto: UpdatePasswordUserDto): Promise<string>;
}
