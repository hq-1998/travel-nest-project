import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendAddDto } from './dto/friend-add.dto';
import pinyin from 'pinyin';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(friendAddDto: FriendAddDto, userId: number) {
    const existingRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        fromUserId: userId,
        toUserId: friendAddDto.friendId,
        status: 0,
      },
    });

    if (existingRequest) {
      return '已有未处理的好友请求，请勿重复发送';
    }
    await this.prismaService.friendRequest.create({
      data: {
        fromUserId: userId,
        toUserId: friendAddDto.friendId,
        reason: friendAddDto.reason,
        status: 0,
      },
    });
    return '请求发送成功';
  }

  async list(userId: number) {
    const res = await this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            nickname: true,
            headPic: true,
          },
        },
      },
    });
    return res;
  }

  async requestNum(userId: number) {
    return await this.prismaService.friendRequest.count({
      where: {
        toUserId: userId,
      },
    });
  }

  async agree(friendId: number, userId: number) {
    const res = await this.prismaService.friendship.findMany({
      where: {
        userId,
        friendId,
      },
    });

    if (res.length) return '已存在';

    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });

    await this.prismaService.friendship.create({
      data: {
        userId,
        friendId,
      },
    });
    return '添加好友成功';
  }

  async reject(friendId: number, userId: number) {
    await this.prismaService.friendRequest.updateMany({
      where: {
        fromUserId: friendId,
        toUserId: userId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });
    return '已拒绝申请';
  }

  async remove(friendId: number, userId: number) {
    await this.prismaService.friendship.deleteMany({
      where: {
        OR: [
          {
            userId,
            friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });

    return '删除成功';
  }

  async getFriendship(userId: number) {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          {
            userId: userId,
          },
          {
            friendId: userId,
          },
        ],
      },
    });

    const set = friends.reduce((pre, cur) => {
      const { userId, friendId } = cur;
      pre.add(friendId);
      pre.add(userId);
      return pre;
    }, new Set<number>());

    const friendIds = [...set].filter((item) => item !== userId);

    const result = [];

    for (let i = 0; i < friendIds.length; i++) {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: friendIds[i],
        },
        select: {
          id: true,
          nickname: true,
          email: true,
          headPic: true,
        },
      });
      result.push({
        ...user,
        py: pinyin(user.nickname).flat(),
      });
    }
    return result;
  }
}
