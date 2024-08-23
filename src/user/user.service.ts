import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { md5 } from 'src/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(RedisService)
  private redisService: RedisService;

  private logger = new Logger();

  async foundUser(condition: any) {
    const findUser = await this.prismaService.user.findUnique({
      where: condition,
    });
    return findUser;
  }

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.OK);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.OK);
    }

    const foundUser = await this.foundUser({
      email: user.email,
    });

    if (foundUser) {
      throw new HttpException('用户名已存在', HttpStatus.OK);
    }

    try {
      return await this.prismaService.user.create({
        data: {
          password: md5(user.password),
          nickname: user.nickname,
          email: user.email,
        },
        select: {
          id: true,
          nickname: true,
          email: true,
          headPic: true,
          createTime: true,
        },
      });
    } catch (e) {
      this.logger.error(e, UserService);
      return null;
    }
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }

    const cryptoPwd = md5(user.password);
    const isMatch = cryptoPwd === foundUser.password;

    if (!isMatch) {
      throw new HttpException('密码错误', HttpStatus.OK);
    }

    return foundUser;
  }

  async generateToken(user: { id: number; email: string }) {
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      {
        expiresIn: '30m',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
    return {
      accessToken: 'Bearer ' + accessToken,
      refreshToken: 'Bearer ' + refreshToken,
    };
  }
}
