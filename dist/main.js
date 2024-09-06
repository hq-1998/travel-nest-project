"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exception_filter_1 = require("./filter/exception.filter");
const format_response_interceptor_1 = require("./interceptor/format-response.interceptor");
const config_1 = require("@nestjs/config");
const dotenv = require("dotenv");
dotenv.config({
    path: process.env.NODE_ENV === 'development'
        ? '.env.development'
        : '.env.production',
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new format_response_interceptor_1.FormatResponseInterceptor());
    app.useGlobalFilters(new exception_filter_1.TravelExceptionFilter());
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Travel')
        .setDescription('api 接口文档')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-doc', app, document);
    await app.listen(configService.get('nest_server_port'));
}
bootstrap();
//# sourceMappingURL=main.js.map