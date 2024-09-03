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
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
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
    const user = await this.userService.register(registerUser);
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
    const refresh = token.split(' ')[1];
    const data = this.jwtService.verify(refresh);
    const foundUser = await this.userService.findUserDetailById(data.userId);
    const { accessToken, refreshToken } =
      await this.userService.generateToken(foundUser);
    return {
      accessToken,
      refreshToken,
    };
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
}
