import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploaderModule } from './uploader/uploader.module';
import { ArticleModule } from './article/article.module';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatroomModule } from './chatroom/chatroom.module';

const configFactory = () => ({
  isGlobal: true,
  envFilePath:
    process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env.production',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFactory], // 使用异步配置工厂
    }),
    PrismaModule,
    UserModule,
    RedisModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_access_token_expires_time'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UploaderModule,
    ArticleModule,
    FriendshipModule,
    ChatroomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
