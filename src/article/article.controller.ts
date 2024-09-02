import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { RequireLogin, UserInfo } from 'src/decorator/custom.decorator';
import { AddArticleDto } from './dto/add-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('add')
  @RequireLogin()
  async addArticle(@UserInfo('userId') userId, @Body() info: AddArticleDto) {
    this.articleService.add(userId, info);
  }

  @Post('list')
  @RequireLogin()
  async getArticleList(
    @Body('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo: number,
    @Body('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.articleService.getList(pageNo, pageSize);
  }

  @Get(':id')
  async getArticleDetail(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getDetailById(id);
  }
}
