"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const user_module_1 = require("./user/user.module");
const redis_module_1 = require("./redis/redis.module");
const email_module_1 = require("./email/email.module");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("./prisma/prisma.service");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./guard/auth.guard");
const config_1 = require("@nestjs/config");
const uploader_module_1 = require("./uploader/uploader.module");
const article_module_1 = require("./article/article.module");
const friendship_module_1 = require("./friendship/friendship.module");
const path = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: path.join(__dirname, '.env'),
            }),
            prisma_module_1.PrismaModule,
            user_module_1.UserModule,
            redis_module_1.RedisModule,
            email_module_1.EmailModule,
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory(configService) {
                    return {
                        secret: configService.get('jwt_secret'),
                        signOptions: {
                            expiresIn: configService.get('jwt_access_token_expires_time'),
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            uploader_module_1.UploaderModule,
            article_module_1.ArticleModule,
            friendship_module_1.FriendshipModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            prisma_service_1.PrismaService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map