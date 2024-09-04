import * as OSS from 'ali-oss';

class AliOss {
  client;
  config;

  constructor() {
    this.config = {};
    this.client = new OSS(this.config);
  }
  async generateSignature() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const res = this.client.calculatePostSignature({
      expiration: date.toISOString(),
      conditions: [['content-length-range', 0, 1048576000]],
    });

    const location = await this.client.getBucketLocation();
    const host = `http://${this.config.bucket}.${location.location}.aliyuncs.com`;

    return {
      host,
      OSSAccessKeyId: res.OSSAccessKeyId,
      Signature: res.Signature,
      policy: res.policy,
    };
  }
}

export default new AliOss();
