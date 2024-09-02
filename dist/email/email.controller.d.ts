import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';
export declare class EmailController {
    private readonly emailService;
    redisService: RedisService;
    userService: UserService;
    constructor(emailService: EmailService);
    captcha(address: string): Promise<string>;
    updateCaptcha(address: string): Promise<string>;
}
