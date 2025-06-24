import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto, GetNewsDto, CreateLikeDto, CreateCommentDto } from './dto';
import { HeadersValidation } from '@decorators';
import { DeviceHeadersDto, ParamId } from '@enums';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  findAll(@Query() query: GetNewsDto) {
    return this.newsService.findAll(query);
  }

  @Get('category')
  async getCategories(@HeadersValidation() headers: DeviceHeadersDto) {
    return this.newsService.getCategories(headers.lang);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Post()
  async create(@Body() data: CreateNewsDto) {
    return this.newsService.create(data);
  }

  @Patch('id')
  async update(@Param() param: ParamId, @Body() data: UpdateNewsDto) {
    return this.newsService.update(param.id, data);
  }

  @Delete(':id')
  async remove(@Param() param: ParamId) {
    return this.newsService.remove(param.id);
  }

  @Post('like')
  like(@Body() data: CreateLikeDto) {
    return this.newsService.createLike(data);
  }

  @Patch('unlike')
  unlike(@Param('user_id') user_id: number, @Param('news_id') news_id: number) {
    return this.newsService.removeLike(user_id, news_id);
  }

  @Post('comment')
  async comment(@Body() data: CreateCommentDto) {
    return this.newsService.createComment(data);
  }
}
