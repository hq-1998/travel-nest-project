import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UserService {
    private prismaService;
    private jwtService;
    private redisService;
    private logger;
    foundUser(condition: any): Promise<{
        id: number;
        email: string;
        password: string;
        nickname: string;
        headPic: string;
        createTime: Date;
        updateTime: Date;
    }>;
    register(user: RegisterUserDto): Promise<{
        id: number;
        email: string;
        nickname: string;
        headPic: string;
        createTime: Date;
    }>;
    login(user: LoginUserDto): Promise<{
        id: number;
        email: string;
        password: string;
        nickname: string;
        headPic: string;
        createTime: Date;
        updateTime: Date;
    }>;
    generateToken(user: {
        id: number;
        email: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
