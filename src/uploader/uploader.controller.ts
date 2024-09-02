import { Controller, Get } from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @Get('signature')
  async generateSignature() {
    return await this.uploaderService.generateSignature();
  }
}
