import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';
import { GetNewsDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllNews(query: GetNewsDto, lang: string) {
    const news = await paginate('news', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: {
        id: true,
        [`title_${lang}`]: true,
        [`summary_${lang}`]: true,
        [`content_${lang}`]: true,
        [`slug_${lang}`]: true,
        image_url: true,
        status: true,
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
            [`name_${lang}`]: true,
            created_at: true,
          },
        },
        likes: true,
        comments: true,
        staffId: true,
        userId: true,
      },
    });
    return news?.data?.map((el: any) => {
      return {
        id: el?.id,
        title: el?.[`title_${lang}`],
        summary: el?.[`summary_${lang}`],
        content: el?.[`content_${lang}`],
        status: el?.status,
        image_url: el?.image_url,
        category: {
          id: el?.category?.id,
          name: el?.category[`name_${lang}`],
        },
        likes: el?.likes?.length,
        views: el?.views,
        comments: el?.comments?.length,
        tags: el?.tags,
        created_at: el?.created_at,
        updated_at: el?.updated_at,
      };
    });
  }

  async findCategory() {
    const categories = await this.prisma.$queryRaw`
    SELECT 
      CAST(COUNT(*) AS INTEGER) as "total",
      CAST(SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS INTEGER) as "active_categories",
      CAST(SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END) AS INTEGER) as "inactive_categories"
    FROM "category"
  `;
    return categories[0] ?? {};
  }
}
