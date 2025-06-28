import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';
import { GetNewsDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllNews(query: GetNewsDto) {
    const news = await paginate('news', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: {
        id: true,
        title_uz: true,
        title_ru: true,
        title_en: true,
        summary_uz: true,
        summary_ru: true,
        summary_en: true,
        content_uz: true,
        content_ru: true,
        content_en: true,
        image_url: true,
        status: true,
        slug_uz: true,
        slug_ru: true,
        slug_en: true,
        tags: true,
        is_hot: true,
        author_id: true,
        views: true,
        created_at: true,
        updated_at: true,
        author: true,
        category: {
          select: {
            id: true,
            name_uz: true,
            name_ru: true,
            name_en: true,
            created_at: true,
          },
        },
        likes: true,
        comments: true,
        staffId: true,
        userId: true,
      },
    });

    return news;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
