import { Injectable } from '@nestjs/common';
import aliOss from 'src/utils/oss';

@Injectable()
export class UploaderService {
  async generateSignature() {
    return await aliOss.generateSignature();
  }
}
