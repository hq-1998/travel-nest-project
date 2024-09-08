export declare class ChatroomService {
    private prismaService;
    createOneToOneChatroom(friendId: number, userId: number): Promise<string>;
    createGroupChatroom(name: string, userId: number): Promise<string>;
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
