import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { FriendAddDto } from './dto/friend-add.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('add')
  @RequireLogin()
  async add(@Body() friendAddDto: FriendAddDto, @UserInfo('userId') userId) {
    return this.friendshipService.add(friendAddDto, userId);
  }

  @Get('request-list')
  @RequireLogin()
  async list(@UserInfo('userId') userId: number) {
    return this.friendshipService.list(userId);
  }

  @Get('agree/:id')
  @RequireLogin()
  async agree(@Param('id') friendId: number, @UserInfo('userId') userId) {
    if (!friendId) {
      throw new BadRequestException('添加的好友id不能为空');
    }
    return this.friendshipService.agree(friendId, userId);
  }

  @Get('reject/:id')
  @RequireLogin()
  async reject(@Param('id') friendId: number, @UserInfo('userId') userId) {
    if (!friendId) {
      throw new BadRequestException('拒绝的好友id不能为空');
    }
    return this.friendshipService.reject(friendId, userId);
  }

  @Get('remove/:id')
  @RequireLogin()
  async remove(@Param('id') friendId: number, @UserInfo('userId') userId) {
    if (!friendId) {
      throw new BadRequestException('删除的好友id不能为空');
    }
    return this.friendshipService.remove(friendId, userId);
  }

  @Get('list')
  @RequireLogin()
  async friendship(@UserInfo('userId') userId: number) {
    return this.friendshipService.getFriendship(userId);
  }
}
