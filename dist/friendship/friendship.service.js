"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pinyin_1 = require("pinyin");
let FriendshipService = class FriendshipService {
    async add(friendAddDto, userId) {
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
    async list(userId) {
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
    async requestNum(userId) {
        return await this.prismaService.friendRequest.count({
            where: {
                toUserId: userId,
            },
        });
    }
    async agree(friendId, userId) {
        const res = await this.prismaService.friendship.findMany({
            where: {
                userId,
                friendId,
            },
        });
        if (res.length)
            return '已存在';
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
    async reject(friendId, userId) {
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
    async remove(friendId, userId) {
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
    async getFriendship(userId) {
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
        }, new Set());
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
                py: (0, pinyin_1.default)(user.nickname).flat(),
            });
        }
        return result;
    }
};
exports.FriendshipService = FriendshipService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], FriendshipService.prototype, "prismaService", void 0);
exports.FriendshipService = FriendshipService = __decorate([
    (0, common_1.Injectable)()
], FriendshipService);
//# sourceMappingURL=friendship.service.js.map