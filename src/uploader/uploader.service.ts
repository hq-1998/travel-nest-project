import { Injectable } from '@nestjs/common';
import AliOss from 'src/utils/oss';

@Injectable()
export class UploaderService {
  async generateSignature() {
    const aliOss = new AliOss();
    return await aliOss.generateSignature();
  }
}
