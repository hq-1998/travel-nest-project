import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdatePasswordUserDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user-dto';
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
    findUserDetailById(userId: number): Promise<{
        id: number;
        email: string;
        nickname: string;
        headPic: string;
        createTime: Date;
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
    updatePassword(passwordDto: UpdatePasswordUserDto): Promise<string>;
    update(userId: number, updateUserDto: UpdateUserDto): Promise<string>;
    getFriendship(userId: number): Promise<any[]>;
}