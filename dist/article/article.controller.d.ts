import { ArticleService } from './article.service';
import { AddArticleDto } from './dto/add-article.dto';
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    addArticle(userId: any, info: AddArticleDto): Promise<void>;
    getArticleList(pageNo: number, pageSize: number): Promise<{
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
    getArticleDetail(id: number): Promise<{
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
