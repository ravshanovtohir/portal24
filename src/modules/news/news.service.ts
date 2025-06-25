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

  async findAll(query: GetNewsDto, lang: string) {
    console.log(query);

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
        status: true,
        category: {
          select: {
            id: true,
            [`name_${lang}`]: true,
          },
        },
        image_url: true,
        tags: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        views: true,
        comments: true,
        likes: true,
        created_at: true,
      },
    });

    // return news?.data?.map((el) => {
    //   return {
    //     id: el?.id,
    //     title: el?.[`title_${lang}`],
    //     summary: el?.[`summary_${lang}`],
    //     content: el?.[`content_${lang}`],
    //     status: el?.status,
    //     image: el?.image_url,
    //     category: {
    //       // id: el?.category?.id,
    //     },
    //   };
    // });
    return news;
  }

  async findOne(slug: string) {
    const post = await this.prisma.news.findFirst({
      where: {
        OR: [
          {
            slug_uz: slug,
            slug_ru: slug,
            summary_en: slug,
          },
        ],
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

    return post;
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

    return categories?.map((category) => {
      return {
        id: category?.id,
        name: category[`name_${lang}`],
      };
    });
  }

  async create(data: CreateNewsDto, authorId: number = 1, file: Express.Multer.File) {
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
        image_url: file.filename,
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

    return 'Пост успешно создан!';
  }

  async update(id: number, data: UpdateNewsDto) {
    const news = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
    });

    if (!news) {
      throw new NotFoundException('Пост с указанным идентификатором не найден!');
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
        ...data,
        category: data.category_id ? { connect: { id: data.category_id } } : undefined,
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

  async createLike(createLikeDto: CreateLikeDto, userId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        user_id_news_id: {
          user_id: userId,
          news_id: createLikeDto.news_id,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('Вам уже понравилась эта новость!');
    }

    return await this.prisma.like.create({
      data: {
        user_id: userId,
        news_id: createLikeDto.news_id,
      },
    });
  }

  async removeLike(news_id: number, user_id: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        user_id_news_id: {
          user_id,
          news_id,
        },
      },
    });

    if (!like) {
      throw new NotFoundException('Нравится не найдено!');
    }

    return this.prisma.like.delete({
      where: {
        user_id_news_id: { user_id, news_id },
      },
    });
  }

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        user_id: userId,
        news_id: createCommentDto.news_id,
      },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async newView(news_id: number) {
    const post = await this.prisma.news.findUnique({
      where: {
        id: news_id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.prisma.news.update({
      where: {
        id: post.id,
      },
      data: {
        views: post.views + 1,
      },
    });

    return 'success';
  }
}
