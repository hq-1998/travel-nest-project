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
exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: '昵称不能为空',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: '密码不能为空',
    }),
    (0, class_validator_1.MinLength)(6, {
        message: '密码不能少于 6 位',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: '邮箱不能为空',
    }),
    (0, class_validator_1.IsEmail)({}, {
        message: '不是合法的邮箱格式',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({
        message: '验证码不能为空',
    }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "captcha", void 0);
//# sourceMappingURL=register-user.dto.js.map