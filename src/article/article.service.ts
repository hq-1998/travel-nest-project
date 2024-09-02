import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddArticleDto } from './dto/add-article.dto';

@Injectable()
export class ArticleService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(userId: number, info: AddArticleDto) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new HttpException(
        `User with ID ${userId} does not exist.`,
        HttpStatus.OK,
      );
    }

    return await this.prismaService.article.create({
      data: {
        title: info.title,
        content: info.content,
        urls: {
          create: info.urls.map((url) => ({
            url,
          })),
        },
        userId,
      },
    });
  }

  async getList(pageNo: number, pageSize: number) {
    const skipCount = (pageNo - 1) * pageSize;

    const records = await this.prismaService.article.findMany({
      skip: skipCount,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            headPic: true,
          },
        },
        urls: {
          select: {
            url: true,
          },
        },
      },
    });

    const total = await this.prismaService.article.count();

    return {
      records: records.map((record) => {
        return {
          ...record,
          urls: record.urls.map((url) => url.url),
        };
      }),
      total,
    };
  }

  async getDetailById(id: number) {
    const result = await this.prismaService.article.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            headPic: true,
          },
        },
        urls: {
          select: {
            url: true,
          },
        },
      },
    });
    return {
      ...result,
      urls: result.urls.map((url) => url.url),
    };
  }
}
