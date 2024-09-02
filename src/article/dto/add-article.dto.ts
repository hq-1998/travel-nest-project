import { MaxLength } from 'class-validator';

export class AddArticleDto {
  @MaxLength(30, {
    message: '标题最多30个字',
  })
  title: string;
  @MaxLength(200, {
    message: '内容最多200个字',
  })
  content: string;
  urls: string[];
}
