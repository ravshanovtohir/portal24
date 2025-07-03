import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GetNewsDto, CreateNewsDto, UpdateNewsDto, CreateLikeDto, CreateCommentDto } from './dto';
import { PrismaService } from '@prisma';
import { formatDate, paginate } from '@helpers';
import { PostType, Status } from '@prisma/client';
import { CategoryResponse, NewsResponse } from '@interfaces';
import slugify from 'slugify';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetNewsDto, lang: string) {
    let select = {};
    let where: any = {};
    let orderBy = {};

    if (query?.post_type) {
      where.type = query.post_type;
    }
    if (query?.type === 'hot') {
      where = {
        is_hot: true,
        status: Status.ACTIVE,
        category: {
          status: Status.ACTIVE,
        },
      };

      select = {
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
        views: true,
        comments: true,
        likes: true,
        created_at: true,
      };
    } else if (query?.type === 'popular') {
      where = {
        status: Status.ACTIVE,
        category: {
          status: Status.ACTIVE,
        },
      };
      select = {
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
        views: true,
        comments: true,
        likes: true,
        created_at: true,
      };
      orderBy = {
        views: 'desc',
      };
    } else {
      where = {
        status: Status.ACTIVE,
        category: {
          status: Status.ACTIVE,
        },
      };
      select = {
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
        views: true,
        comments: true,
        likes: true,
        created_at: true,
      };
      orderBy = {
        created_at: 'desc',
      };
      // throw new BadRequestException('Неверный тип для новостей!');
    }

    const news = await paginate('news', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: select,
      where: where,
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
        reading_time: el?.[`content_${lang}`]?.length / 200 || 0,
        views: el?.views,
        comments: el?.likes?.length,
        created_at: formatDate(el?.created_at, lang),
      };
    });
    console.log(data);

    return {
      ...news,
      data,
    };

    // return news?.data?.map((el: any) => {
    //   return {
    //     id: el?.id,
    //     title: el?.[`title_${lang}`],
    //     summary: el?.[`summary_${lang}`],
    //     content: el?.[`content_${lang}`],
    //     status: el?.status,
    //     image_url: el?.image_url,
    //     category: {
    //       id: el?.category?.id,
    //       name: el?.category[`name_${lang}`],
    //     },
    //     likes: el?.likes?.length,
    //     views: el?.views,
    //     comments: el?.likes?.length,
    //     created_at: el?.created_at,
    //   };
    // });
  }

  async findOne(slug: string, lang: string) {
    const post = await this.prisma.news.findFirst({
      where: {
        OR: [
          {
            slug_uz: slug,
            slug_ru: slug,
            slug_en: slug,
          },
        ],
      },
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
            [`title_${lang}`]: true,
            [`seo_title_${lang}`]: true,
            [`description_${lang}`]: true,
          },
        },
        image_url: true,
        tags: true,
        views: true,
        comments: true,
        likes: true,
        created_at: true,
      },
    });

    console.log(post);

    return {
      id: post?.id,
      title: post?.[`title_${lang}`],
      summary: post?.[`summary_${lang}`],
      content: post?.[`content_${lang}`],
      status: post?.status,
      image: post?.image_url,
      category: {
        name: post?.category[`name_${lang}`],
        title: post?.category[`title_${lang}`],
        seo_description: post?.category[`description_${lang}`],
        seo_title: post?.category[`seo_title_${lang}`],
      },
      likes: post?.likes?.length,
      views: post?.views,
      comments: post?.likes?.length,
      reading_time: post?.[`content_${lang}`]?.length / 200 || 0,
      // created_at: formatDate(post.created_at, lang),
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
        [`title_${lang}`]: true,
        [`seo_title_${lang}`]: true,
        [`seo_description_${lang}`]: true,
      },
      orderBy: {
        order_number: 'asc',
      },
    });

    return categories?.map((category) => {
      return {
        id: category?.id,
        name: category[`name_${lang}`],
        title: category[`title_${lang}`],
        seo_description: category[`description_${lang}`],
        seo_title: category[`seo_title_${lang}`],
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
        category_id: data?.category_id,
        author_id: authorId,
        is_hot: data?.is_hot,
        type: (data?.type as PostType) ?? null,
      },
    });

    return 'Пост успешно создан!';
  }

  async saveMedia(file: Express.Multer.File) {
    return {
      file: file.path,
    };
  }

  async uploadBanner(file: Express.Multer.File) {
    return {
      file: file.path,
    };
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
    // if (news.slug) {
    //   const existingSlug = await this.prisma.news.findUnique({
    //     where: { slug: news.slug },
    //   });
    //   if (existingSlug && existingSlug.id !== id) {
    //     throw new ConflictException('Bu slug allaqachon ishlatilgan');
    //   }
    // }
    await this.prisma.news.update({
      where: { id },
      data: {
        ...data,
        status: (data.status as Status) ?? news.status,
        type: (data.type as PostType) ?? news.type,
        // ca: data.category_id ? { connect: { id: data.category_id } } : undefined,
      },
    });

    return 'Пост успешно обновлен!';
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
