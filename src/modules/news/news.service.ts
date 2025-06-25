import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GetNewsDto, CreateNewsDto, UpdateNewsDto, CreateLikeDto, CreateCommentDto } from './dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';
import { Status } from '@prisma/client';
import { CategoryResponse } from '@interfaces';
import slugify from 'slugify';

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
  // Comment relatsiyasi
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
      where: {
        status: Status.ACTIVE,
      },
      select: {
        id: true,
        [`name_${lang}`]: true,
      },
    });

    const result: CategoryResponse[] = [];
    return categories?.map((category) => {
      return {
        id: category?.id,
        name: category[`name_${lang}`],
      };
    });
  }

  async create(data: CreateNewsDto, authorId: number = 1) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: data.category_id,
      },
    });

    if (!category) {
      throw new NotFoundException('Категория с указанным идентификатором не найдена!');
    }

    await this.prisma.news.create({
      data: {
        title_uz: data.title_uz,
        title_ru: data.title_ru,
        title_en: data.title_en,
        summary_uz: data.summary_uz,
        summary_ru: data.summary_ru,
        summary_en: data.summary_en,
        content_uz: data.content_uz,
        content_ru: data.content_ru,
        content_en: data.content_en,
        image_url: data.image_url,
        slug_uz: slugify(data.title_uz, { lower: true, strict: true }),
        slug_ru: slugify(data.title_ru, { lower: true, strict: true }),
        slug_en: slugify(data.title_en, { lower: true, strict: true }),
        tags: data.tags,
        categoty_id: data?.category_id,
        author_id: authorId,
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
    // if (updateNewsDto.slug) {
    //   const existingSlug = await this.prisma.news.findUnique({
    //     where: { slug: updateNewsDto.slug },
    //   });
    //   if (existingSlug && existingSlug.id !== id) {
    //     throw new ConflictException('Bu slug allaqachon ishlatilgan');
    //   }
    // }
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
