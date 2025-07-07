import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { PrismaService } from '@prisma';
import { formatDate, paginate } from '@helpers';
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            [`name_${lang}`]: true,
            created_at: true,
          },
        },
        likes: true,
        comments: true,
        content_type: true,
        youtube_id: true,
        comment_available: true,
        staffId: true,
        userId: true,
      },
    });

    const data = news?.data?.map((el: any) => {
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
        is_hot: el?.is_hot,
        views: el?.views,
        comments: el?.comments?.length,
        content_type: el?.content_type,
        reading_time: Math.floor(el?.[`content_${lang}`]?.length / 200 || 0) || 0,
        youtube_id: el?.youtube_id,
        author: el?.author,
        tags: el?.tags,
        comment_available: el?.comment_available,
        created_at: formatDate(el?.created_at, lang),
        updated_at: el?.updated_at,
      };
    });

    return {
      ...news,
      data,
    };
  }

  async getNewsById(id: number) {
    const news = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
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
        content_type: true,
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            // order_number: true,
            name_uz: true,
            name_ru: true,
            name_en: true,
            // title_uz: true,
            // title_ru: true,
            // title_en: true,
            // seo_title_uz: true,
            // seo_title_ru: true,
            // seo_title_en: true,
            // seo_description_uz: true,
            // seo_description_ru: true,
            // seo_description_en: true,
            // status: true,
            // created_at: true,
            // updated_at: true,
          },
        },
        views: true,
        likes: true,
        comments: true,
        youtube_id: true,
        created_at: true,
        comment_available: true,
        updated_at: true,
      },
    });
    if (!news) {
      throw new NotFoundException();
    }
    return {
      ...news,
      likes: news.likes.length,
      created_at: formatDate(news?.created_at, 'uz'),
      comment: news.comments.length,
      reading_time: Math.floor(news?.content_uz?.length / 200 || 0),
    };
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
