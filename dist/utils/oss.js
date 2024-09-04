"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OSS = require("ali-oss");
class AliOss {
    constructor() {
        this.config = {
            region: process.env.OSS_REGION,
            bucket: process.env.OSS_BUCKET,
            accessKeyId: process.env.OSS_ACCESSKEY_ID,
            accessKeySecret: process.env.OSS_ACCESSKEY_SECRET,
        };
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
exports.default = new AliOss();
//# sourceMappingURL=oss.js.map