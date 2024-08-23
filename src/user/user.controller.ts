import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { ApiTags, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { TravelExceptionFilter } from 'src/filter/exception.filter';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { UpdatePasswordUserDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user-dto';

@ApiTags('用户管理模块')
@Controller('user')
@UseFilters(TravelExceptionFilter)
export class UserController {
  @Inject(RedisService)
  redisService: RedisService;

  @Inject(EmailService)
  emailService: EmailService;

  @Inject(JwtService)
  jwtService: JwtService;
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功/失败/验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    const result = await this.userService.register(registerUser);
    return result;
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);
    const { accessToken, refreshToken } =
      await this.userService.generateToken(user);

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      headPic: user.headPic,
      createTime: user.createTime,
    };
    vo.accessToken = accessToken;
    vo.refreshToken = refreshToken;
    return vo;
  }

  @Get('refresh-token')
  async refreshToken(@Query('token') token: string) {
    const data = this.jwtService.verify(token);
    const foundUser = await this.userService.findUserDetailById(data.id);
    const { accessToken, refreshToken } =
      await this.userService.generateToken(foundUser);
    return {
      accessToken,
      refreshToken,
    };
  }

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
  @RequireLogin()
  async updateCaptcha(@UserInfo('userId') userId: number) {
    const code = Math.random().toString().slice(2, 8);
    const { email: address } =
      await this.userService.findUserDetailById(userId);

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

  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserDetailById(userId);
  }

  @Post('update')
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @Post('update-password')
  async updatePassword(@Body() passwordDto: UpdatePasswordUserDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Get('friendship')
  @RequireLogin()
  async friendship(@UserInfo('userId') userId: number) {
    return this.userService.getFriendship(userId);
  }
}
