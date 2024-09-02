import { AddArticleDto } from './dto/add-article.dto';
export declare class ArticleService {
    private prismaService;
    add(userId: number, info: AddArticleDto): Promise<{
        id: number;
        title: string;
        content: string;
        createTime: Date;
        updateTime: Date;
        userId: number;
        commentCount: number;
        likeCount: number;
        favoriteCount: number;
        address: string | null;
    }>;
    getList(pageNo: number, pageSize: number): Promise<{
        records: {
            urls: string[];
            user: {
                id: number;
                nickname: string;
                headPic: string;
            };
            id: number;
            title: string;
            content: string;
            createTime: Date;
            updateTime: Date;
            userId: number;
            commentCount: number;
            likeCount: number;
            favoriteCount: number;
            address: string | null;
        }[];
        total: number;
    }>;
    getDetailById(id: number): Promise<{
        urls: string[];
        user: {
            id: number;
            nickname: string;
            headPic: string;
        };
        id: number;
        title: string;
        content: string;
        createTime: Date;
        updateTime: Date;
        userId: number;
        commentCount: number;
        likeCount: number;
        favoriteCount: number;
        address: string | null;
    }>;
}
