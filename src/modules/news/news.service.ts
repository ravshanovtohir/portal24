import { HttpStatus, Injectable } from '@nestjs/common';
import { GetNewsDto, CreateNewsDto, UpdateNewsDto } from './dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: GetNewsDto) {
    const news = await paginate('news', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        category: true,
        tags: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        views: true,
        created_at: true,
      },
    });

    return {
      status: HttpStatus.OK,
      data: news,
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        category: true,
        tags: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        views: true,
        created_at: true,
      },
    });

    return {
      status: HttpStatus.OK,
      data: post,
    };
  }
  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
