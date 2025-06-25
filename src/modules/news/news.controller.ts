import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto, GetNewsDto, CreateLikeDto, CreateCommentDto } from './dto';
import { HeadersValidation } from '@decorators';
import { DeviceHeadersDto, ParamId } from '@enums';
import { IUser } from '@interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';

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

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.newsService.findOne(slug);
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/insurance_partner_logo',
        filename: (_, file, cb) => {
          const uuid = uuidv4();
          const filename = `${uuid}-${file.originalname.replace(/\s+/g, '')}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|svg)$/)) {
          return cb(new BadRequestException('Неверный тип файла!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @Post()
  async create(@Body() data: CreateNewsDto, @Req() request: IUser, @UploadedFile() file: Express.Multer.File) {
    return this.newsService.create(data, request?.id, file);
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
  like(@Body() data: CreateLikeDto, @Req() request: IUser) {
    return this.newsService.createLike(data, request?.id);
  }

  @Patch('unlike')
  unlike(@Param('news_id') news_id: number, @Req() request: IUser) {
    return this.newsService.removeLike(news_id, request?.id);
  }

  @Post('comment')
  async comment(@Body() data: CreateCommentDto, @Req() request: IUser) {
    return this.newsService.createComment(data, request?.id);
  }
}
