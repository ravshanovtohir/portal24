import { HttpStatus, Injectable } from '@nestjs/common';
import { GetNewsDto, CreateNewsDto, UpdateNewsDto } from './dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';
import { Status } from '@prisma/client';
import { CategoryResponse } from '@interfaces';

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

  async getCategories(lang: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        status: Status.ACTIVE,
      },
      select: {
        id: true,
        name_uz: true,
        name_ru: true,
        name_en: true,
      },
    });

    const result: CategoryResponse[] = [];

    categories?.map((category: any) => {
      result?.push({
        id: category?.id,
        name: category[`name_${lang}`],
      });
    });

    return {
      status: HttpStatus.OK,
      data: result,
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
