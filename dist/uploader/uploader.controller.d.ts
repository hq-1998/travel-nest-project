import { UploaderService } from './uploader.service';
export declare class UploaderController {
    private readonly uploaderService;
    constructor(uploaderService: UploaderService);
    generateSignature(): Promise<{
        host: string;
        OSSAccessKeyId: any;
        Signature: any;
        policy: any;
    }>;
}
