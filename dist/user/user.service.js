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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const utils_1 = require("../utils");
const jwt_1 = require("@nestjs/jwt");
let UserService = UserService_1 = class UserService {
    constructor() {
        this.logger = new common_1.Logger();
    }
    async foundUser(condition) {
        const findUser = await this.prismaService.user.findUnique({
            where: condition,
        });
        return findUser;
    }
    async findUserDetailById(userId) {
        const res = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                nickname: true,
                headPic: true,
                createTime: true,
            },
        });
        return res;
    }
    async register(user) {
        const captcha = await this.redisService.get(`captcha_${user.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.OK);
        }
        if (user.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.OK);
        }
        const foundUser = await this.foundUser({
            email: user.email,
        });
        if (foundUser) {
            throw new common_1.HttpException('用户名已存在', common_1.HttpStatus.OK);
        }
        try {
            return await this.prismaService.user.create({
                data: {
                    password: (0, utils_1.md5)(user.password),
                    nickname: user.nickname,
                    email: user.email,
                },
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                    headPic: true,
                    createTime: true,
                },
            });
        }
        catch (e) {
            this.logger.error(e, UserService_1);
            return null;
        }
    }
    async login(user) {
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                email: user.email,
            },
        });
        if (!foundUser) {
            throw new common_1.HttpException('用户不存在', common_1.HttpStatus.OK);
        }
        const cryptoPwd = (0, utils_1.md5)(user.password);
        const isMatch = cryptoPwd === foundUser.password;
        if (!isMatch) {
            throw new common_1.HttpException('密码错误', common_1.HttpStatus.OK);
        }
        return foundUser;
    }
    async generateToken(user) {
        const accessToken = this.jwtService.sign({
            userId: user.id,
            email: user.email,
        }, {
            expiresIn: '30m',
        });
        const refreshToken = this.jwtService.sign({
            userId: user.id,
        }, {
            expiresIn: '7d',
        });
        return {
            accessToken: 'Bearer ' + accessToken,
            refreshToken: 'Bearer ' + refreshToken,
        };
    }
    async updatePassword(passwordDto) {
        const captcha = await this.redisService.get(`update_password_captcha_${passwordDto.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.OK);
        }
        if (passwordDto.captcha !== captcha) {
            throw new common_1.HttpException('验证码不正确', common_1.HttpStatus.OK);
        }
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                email: passwordDto.email,
            },
        });
        foundUser.password = (0, utils_1.md5)(passwordDto.password);
        await this.prismaService.user.update({
            where: {
                id: foundUser.id,
            },
            data: foundUser,
        });
        return '密码修改成功';
    }
    async update(userId, updateUserDto) {
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (updateUserDto.headPic) {
            foundUser.headPic = updateUserDto.headPic;
        }
        if (updateUserDto.nickname) {
            foundUser.nickname = updateUserDto.nickname;
        }
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: foundUser,
        });
        return '用户信息修改成功';
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
            result.push(user);
        }
        return result;
    }
};
exports.UserService = UserService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], UserService.prototype, "prismaService", void 0);
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], UserService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map