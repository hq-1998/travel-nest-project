import { ChatroomService } from './chatroom.service';
export declare class ChatroomController {
    private readonly chatroomService;
    constructor(chatroomService: ChatroomService);
    oneToOne(friendId: number, userId: number): Promise<string>;
    group(name: string, userId: number): Promise<string>;
    list(userId: number): Promise<{
        id: number;
        name: string;
        type: boolean;
        createTime: Date;
    }[]>;
    members(chatroomId: number): Promise<{
        id: number;
        nickname: string;
        headPic: string;
    }[]>;
}
