declare class AliOss {
    client: any;
    config: any;
    constructor();
    generateSignature(): Promise<{
        host: string;
        OSSAccessKeyId: any;
        Signature: any;
        policy: any;
    }>;
}
declare const _default: AliOss;
export default _default;
