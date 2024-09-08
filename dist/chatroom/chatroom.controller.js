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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomController = void 0;
const common_1 = require("@nestjs/common");
const chatroom_service_1 = require("./chatroom.service");
const custom_decorator_1 = require("../decorator/custom.decorator");
let ChatroomController = class ChatroomController {
    constructor(chatroomService) {
        this.chatroomService = chatroomService;
    }
    async oneToOne(friendId, userId) {
        if (!friendId) {
            throw new common_1.BadRequestException('聊天好友的id不能为空');
        }
        return this.chatroomService.createOneToOneChatroom(friendId, userId);
    }
    async group(name, userId) {
        return this.chatroomService.createGroupChatroom(name, userId);
    }
    async list(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('userId 不能为空');
        }
        return this.chatroomService.list(userId);
    }
    async members(chatroomId) {
        if (!chatroomId) {
            throw new common_1.BadRequestException('聊天室id不能为空');
        }
        return this.chatroomService.members(chatroomId);
    }
};
exports.ChatroomController = ChatroomController;
__decorate([
    (0, common_1.Get)('create-one-to-one'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, common_1.Query)('friendId')),
    __param(1, (0, custom_decorator_1.UserInfo)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "oneToOne", null);
__decorate([
    (0, common_1.Get)('create-group'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, custom_decorator_1.UserInfo)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "group", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('members'),
    __param(0, (0, common_1.Query)('chatroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatroomController.prototype, "members", null);
exports.ChatroomController = ChatroomController = __decorate([
    (0, common_1.Controller)('chatroom'),
    __metadata("design:paramtypes", [chatroom_service_1.ChatroomService])
], ChatroomController);
//# sourceMappingURL=chatroom.controller.js.map