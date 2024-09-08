import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('create-one-to-one')
  @RequireLogin()
  async oneToOne(
    @Query('friendId') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    if (!friendId) {
      throw new BadRequestException('聊天好友的id不能为空');
    }
    return this.chatroomService.createOneToOneChatroom(friendId, userId);
  }

  @Get('create-group')
  @RequireLogin()
  async group(@Query('name') name: string, @UserInfo('userId') userId: number) {
    return this.chatroomService.createGroupChatroom(name, userId);
  }

  @Get('list')
  @RequireLogin()
  async list(@UserInfo('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('userId 不能为空');
    }
    return this.chatroomService.list(userId);
  }

  @Get('members')
  async members(@Query('chatroomId') chatroomId: number) {
    if (!chatroomId) {
      throw new BadRequestException('聊天室id不能为空');
    }
    return this.chatroomService.members(chatroomId);
  }
}
