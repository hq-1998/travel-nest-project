import { FriendshipService } from './friendship.service';
import { FriendAddDto } from './dto/friend-add.dto';
export declare class FriendshipController {
    private readonly friendshipService;
    constructor(friendshipService: FriendshipService);
    add(friendAddDto: FriendAddDto, userId: any): Promise<"已有未处理的好友请求，请勿重复发送" | "请求发送成功">;
    list(userId: number): Promise<{
        id: number;
        fromUserId: number;
        toUserId: number;
        reason: string;
        status: number;
        createTime: Date;
        updateTime: Date;
    }[]>;
    agree(friendId: number, userId: any): Promise<"已存在" | "添加好友成功">;
    reject(friendId: number, userId: any): Promise<string>;
    remove(friendId: number, userId: any): Promise<string>;
    friendship(userId: number): Promise<any[]>;
}
