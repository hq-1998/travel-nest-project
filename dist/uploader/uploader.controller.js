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
exports.UploaderController = void 0;
const common_1 = require("@nestjs/common");
const uploader_service_1 = require("./uploader.service");
let UploaderController = class UploaderController {
    constructor(uploaderService) {
        this.uploaderService = uploaderService;
    }
    async generateSignature() {
        return await this.uploaderService.generateSignature();
    }
};
exports.UploaderController = UploaderController;
__decorate([
    (0, common_1.Get)('signature'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UploaderController.prototype, "generateSignature", null);
exports.UploaderController = UploaderController = __decorate([
    (0, common_1.Controller)('uploader'),
    __metadata("design:paramtypes", [uploader_service_1.UploaderService])
], UploaderController);
//# sourceMappingURL=uploader.controller.js.map