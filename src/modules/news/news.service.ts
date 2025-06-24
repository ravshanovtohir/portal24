import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GetNewsDto, CreateNewsDto, UpdateNewsDto, CreateLikeDto, CreateCommentDto } from './dto';
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
        title_uz: true,
        title_ru: true,
        title_en: true,
        summary_uz: true,
        summary_ru: true,
        summary_en: true,
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
        title_uz: true,
        title_ru: true,
        title_en: true,
        summary_uz: true,
        summary_ru: true,
        summary_en: true,
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
      // where: {
      //   status: Status.ACTIVE,
      // },
      select: {
        id: true,
        [`name_${lang}`]: true,
      },
    });

    const result: CategoryResponse[] = [];

    // categories?.map((category) => {
    //   result?.push({
    //     id: category?.id,
    //     name: category?.,
    //   });
    // });

    return {
      status: HttpStatus.OK,
      data: categories.map((el) => {
        return {
          data: [
            {
              id: el.id,
              name: el[`name_${lang}`],
            },
          ],
        };
      }),
    };
  }

  async create(createNewsDto: CreateNewsDto) {
    const existingSlug = await this.prisma.news.findUnique({
      where: { slug: createNewsDto.slug },
    });
    if (existingSlug) {
      throw new ConflictException('this slug is already in use');
    }

    await this.prisma.news.create({
      data: {
        title_uz: createNewsDto.title_uz,
        title_ru: createNewsDto.title_ru,
        title_en: createNewsDto.title_en,
        summary_uz: createNewsDto.summary_uz,
        summary_ru: createNewsDto.summary_ru,
        summary_en: createNewsDto.summary_en,
        content_uz: createNewsDto.content_uz,
        content_ru: createNewsDto.content_ru,
        content_en: createNewsDto.content_en,
        image_url: createNewsDto.image_url,
        slug: createNewsDto.slug,
        tags: createNewsDto.tags,
        category: { connect: { id: createNewsDto.category_id } },
        author: { connect: { id: createNewsDto.author_id } },
      },
      include: {
        author: { select: { id: true, email: true } },
        category: true,
      },
    });

    return {
      status: HttpStatus.OK,
    };
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException();
    }
    if (updateNewsDto.slug) {
      const existingSlug = await this.prisma.news.findUnique({
        where: { slug: updateNewsDto.slug },
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('Bu slug allaqachon ishlatilgan');
      }
    }
    return this.prisma.news.update({
      where: { id },
      data: {
        ...updateNewsDto,
        category: updateNewsDto.category_id ? { connect: { id: updateNewsDto.category_id } } : undefined,
      },
      include: { author: true, category: true },
    });
  }

  async remove(id: number) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException();
    }
    return this.prisma.news.delete({ where: { id } });
  }

  async createLike(createLikeDto: CreateLikeDto) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        user_id_news_id: {
          user_id: createLikeDto.user_id,
          news_id: createLikeDto.news_id,
        },
      },
    });
    if (existingLike) {
      throw new ConflictException('Bu yangilikni allaqachon yoqtirgansiz');
    }
    return this.prisma.like.create({
      data: {
        user_id: createLikeDto.user_id,
        news_id: createLikeDto.news_id,
      },
    });
  }

  async removeLike(user_id: number, news_id: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        user_id_news_id: { user_id, news_id },
      },
    });
    if (!like) {
      throw new NotFoundException('Like topilmadi');
    }
    return this.prisma.like.delete({
      where: {
        user_id_news_id: { user_id, news_id },
      },
    });
  }

  async createComment(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        user_id: createCommentDto.user_id,
        news_id: createCommentDto.news_id,
      },
      include: { user: { select: { id: true, email: true } } },
    });
  }
}
