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
exports.AddArticleDto = void 0;
const class_validator_1 = require("class-validator");
class AddArticleDto {
}
exports.AddArticleDto = AddArticleDto;
__decorate([
    (0, class_validator_1.MaxLength)(30, {
        message: '标题最多30个字',
    }),
    __metadata("design:type", String)
], AddArticleDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(200, {
        message: '内容最多200个字',
    }),
    __metadata("design:type", String)
], AddArticleDto.prototype, "content", void 0);
//# sourceMappingURL=add-article.dto.js.map