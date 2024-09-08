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
exports.ChatroomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatroomService = class ChatroomService {
    async createOneToOneChatroom(friendId, userId) {
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
    async createGroupChatroom(name, userId) {
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
    async list(userId) {
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
    async members(chatroomId) {
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
};
exports.ChatroomService = ChatroomService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], ChatroomService.prototype, "prismaService", void 0);
exports.ChatroomService = ChatroomService = __decorate([
    (0, common_1.Injectable)()
], ChatroomService);
//# sourceMappingURL=chatroom.service.js.map