export declare class RedisService {
    private redisClient;
    get(key: string): Promise<string>;
    set(key: string, value: string | number, ttl?: number): Promise<void>;
    hashGet(key: string): Promise<{
        [x: string]: string;
    }>;
    hashSet(key: string, obj: Record<string, any>, ttl?: number): Promise<void>;
}
