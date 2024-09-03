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
import { UpdatePasswordUserDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user-dto';

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

  async findUserDetailById(userId: number) {
    const res = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        headPic: true,
        createTime: true,
        address: true,
      },
    });
    return res;
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

  async updatePassword(passwordDto: UpdatePasswordUserDto) {
    const captcha = await this.redisService.get(
      `update_password_captcha_${passwordDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.OK);
    }

    if (passwordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.OK);
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: passwordDto.email,
      },
    });

    foundUser.password = md5(passwordDto.password);
    await this.prismaService.user.update({
      where: {
        id: foundUser.id,
      },
      data: foundUser,
    });

    return '密码修改成功';
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (updateUserDto.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }

    if (updateUserDto.nickname) {
      foundUser.nickname = updateUserDto.nickname;
    }

    if (updateUserDto.address) {
      foundUser.address = updateUserDto.address;
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: foundUser,
    });

    return '用户信息修改成功';
  }
}
