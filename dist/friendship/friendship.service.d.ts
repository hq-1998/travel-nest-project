import { FriendAddDto } from './dto/friend-add.dto';
export declare class FriendshipService {
    private prismaService;
    add(friendAddDto: FriendAddDto, userId: number): Promise<"已有未处理的好友请求，请勿重复发送" | "请求发送成功">;
    list(userId: number): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        reason: string;
        status: number;
        createTime: Date;
        updateTime: Date;
    }[]>;
    agree(friendId: number, userId: number): Promise<"已存在" | "添加好友成功">;
    reject(friendId: number, userId: number): Promise<string>;
    remove(friendId: number, userId: number): Promise<string>;
    getFriendship(userId: number): Promise<any[]>;
}
