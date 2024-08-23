import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  @Inject(ConfigService)
  private configService: ConfigService;
  constructor(private readonly appService: AppService) {}
}
