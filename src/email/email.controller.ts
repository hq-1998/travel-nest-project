import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';

@Controller('email')
export class EmailController {
  @Inject(RedisService)
  redisService: RedisService;

  @Inject(UserService)
  userService: UserService;

  constructor(private readonly emailService: EmailService) {}

  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是：${code}</p>`,
    });

    return '发送成功';
  }

  @Get('update-captcha')
  async updateCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      5 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改用户信息验证码',
      html: `<p>你的注册验证码是：${code}</p>`,
    });

    return '发送成功';
  }
}
