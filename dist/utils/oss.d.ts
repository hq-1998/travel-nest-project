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
export default AliOss;
