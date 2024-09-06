import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TravelExceptionFilter } from './filter/exception.filter';
import { FormatResponseInterceptor } from './interceptor/format-response.interceptor';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env.production',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new TravelExceptionFilter());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Travel')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
