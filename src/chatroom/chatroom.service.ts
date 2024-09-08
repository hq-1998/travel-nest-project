import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prismaService: PrismaService;
  async createOneToOneChatroom(friendId: number, userId: number) {
    const { id: chatroomId } = await this.prismaService.chatroom.create({
      data: {
        name: '聊天室' + Math.random().toString().slice(2, 8),
        type: false,
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId: friendId,
        chatroomId,
      },
    });

    return '单聊创建成功';
  }

  async createGroupChatroom(name: string, userId: number) {
    const { id: chatroomId } = await this.prismaService.chatroom.create({
      data: {
        name,
        type: true,
      },
    });

    await this.prismaService.userChatroom.create({
      data: {
        userId,
        chatroomId,
      },
    });

    return '群聊创建成功';
  }

  async list(userId: number) {
    const chatroomIds = await this.prismaService.userChatroom.findMany({
      where: {
        userId,
      },
      select: {
        chatroomId: true,
      },
    });

    const chatRooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: chatroomIds.map((item) => item.chatroomId),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true,
      },
    });

    return chatRooms;
  }

  async members(chatroomId: number) {
    const userIds = await this.prismaService.userChatroom.findMany({
      where: {
        chatroomId,
      },
      select: {
        userId: true,
      },
    });

    return await this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.userId),
        },
      },
      select: {
        id: true,
        nickname: true,
        headPic: true,
      },
    });
  }
}
