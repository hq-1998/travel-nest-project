import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private configService;
    constructor(appService: AppService);
    getHello(): string;
}
