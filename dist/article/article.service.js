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
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticleService = class ArticleService {
    async add(userId, info) {
        const userExists = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!userExists) {
            throw new common_1.HttpException(`User with ID ${userId} does not exist.`, common_1.HttpStatus.OK);
        }
        return await this.prismaService.article.create({
            data: {
                title: info.title,
                content: info.content,
                urls: {
                    create: info.urls.map((url) => ({
                        url,
                    })),
                },
                userId,
            },
        });
    }
    async getList(pageNo, pageSize) {
        const skipCount = (pageNo - 1) * pageSize;
        const records = await this.prismaService.article.findMany({
            skip: skipCount,
            take: pageSize,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        headPic: true,
                    },
                },
                urls: {
                    select: {
                        url: true,
                    },
                },
            },
        });
        const total = await this.prismaService.article.count();
        return {
            records: records.map((record) => {
                return {
                    ...record,
                    urls: record.urls.map((url) => url.url),
                };
            }),
            total,
        };
    }
    async getDetailById(id) {
        const result = await this.prismaService.article.findFirst({
            where: {
                id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        headPic: true,
                    },
                },
                urls: {
                    select: {
                        url: true,
                    },
                },
            },
        });
        return {
            ...result,
            urls: result.urls.map((url) => url.url),
        };
    }
};
exports.ArticleService = ArticleService;
__decorate([
    (0, common_1.Inject)(prisma_service_1.PrismaService),
    __metadata("design:type", prisma_service_1.PrismaService)
], ArticleService.prototype, "prismaService", void 0);
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)()
], ArticleService);
//# sourceMappingURL=article.service.js.map