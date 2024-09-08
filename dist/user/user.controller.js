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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const register_user_dto_1 = require("./dto/register-user.dto");
const redis_service_1 = require("../redis/redis.service");
const email_service_1 = require("../email/email.service");
const swagger_1 = require("@nestjs/swagger");
const login_user_dto_1 = require("./dto/login-user.dto");
const exception_filter_1 = require("../filter/exception.filter");
const jwt_1 = require("@nestjs/jwt");
const login_user_vo_1 = require("./vo/login-user.vo");
const custom_decorator_1 = require("../decorator/custom.decorator");
const update_user_password_dto_1 = require("./dto/update-user-password.dto");
const update_user_dto_1 = require("./dto/update-user-dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(registerUser) {
        const user = await this.userService.register(registerUser);
        const { accessToken, refreshToken } = await this.userService.generateToken(user);
        const vo = new login_user_vo_1.LoginUserVo();
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
    async login(loginUser) {
        const user = await this.userService.login(loginUser);
        const { accessToken, refreshToken } = await this.userService.generateToken(user);
        const vo = new login_user_vo_1.LoginUserVo();
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
    async refreshToken(token) {
        const refresh = token.split(' ')[1];
        const data = this.jwtService.verify(refresh);
        const foundUser = await this.userService.findUserDetailById(data.userId);
        const { accessToken, refreshToken } = await this.userService.generateToken(foundUser);
        return {
            accessToken,
            refreshToken,
        };
    }
    async info(userId, id) {
        return this.userService.findUserDetailById(id ?? userId);
    }
    async update(userId, updateUserDto) {
        return await this.userService.update(userId, updateUserDto);
    }
    async updatePassword(passwordDto) {
        return this.userService.updatePassword(passwordDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserController.prototype, "redisService", void 0);
__decorate([
    (0, common_1.Inject)(email_service_1.EmailService),
    __metadata("design:type", email_service_1.EmailService)
], UserController.prototype, "emailService", void 0);
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], UserController.prototype, "jwtService", void 0);
__decorate([
    (0, swagger_1.ApiBody)({ type: register_user_dto_1.RegisterUserDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '注册成功/失败/验证码已失效/验证码不正确/用户已存在',
        type: String,
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('refresh-token'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __param(1, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, common_1.Post)('update'),
    (0, custom_decorator_1.RequireLogin)(),
    __param(0, (0, custom_decorator_1.UserInfo)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('update-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_password_dto_1.UpdatePasswordUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('用户管理模块'),
    (0, common_1.Controller)('user'),
    (0, common_1.UseFilters)(exception_filter_1.TravelExceptionFilter),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map