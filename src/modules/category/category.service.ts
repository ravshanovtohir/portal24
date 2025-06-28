import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GetCategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';
import { Status } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: GetCategoryDto) {
    const categories = await paginate('category', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: {
        id: true,
        order_number: true,
        name_uz: true,
        name_ru: true,
        name_en: true,
        title_uz: true,
        title_ru: true,
        title_en: true,
        seo_title_uz: true,
        seo_title_ru: true,
        seo_title_en: true,
        seo_description_uz: true,
        seo_description_ru: true,
        seo_description_en: true,
        status: true,
        _count: {
          select: {
            news: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        order_number: 'asc',
      },
    });

    const mapped = {
      ...categories,
      data: categories.data.map((category: any) => {
        const { _count, ...rest } = category;
        return {
          ...rest,
          news_count: _count?.news ?? 0,
        };
      }),
    };

    return mapped;
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        order_number: true,
        name_uz: true,
        name_ru: true,
        name_en: true,
        title_uz: true,
        title_ru: true,
        title_en: true,
        seo_title_uz: true,
        seo_title_ru: true,
        seo_title_en: true,
        seo_description_uz: true,
        seo_description_ru: true,
        seo_description_en: true,
        status: true,
        _count: {
          select: {
            news: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Категория с указанным идентификатором не найдена!');
    }

    const { _count, ...rest } = category;

    return {
      ...rest,
      news_count: _count?.news ?? 0,
    };
  }

  async create(data: CreateCategoryDto) {
    const categoryNameExists = await this.prisma.category.findFirst({
      where: {
        OR: [
          {
            name_uz: data.name_uz,
            name_ru: data.name_ru,
            name_en: data.name_en,
          },
        ],
      },
    });

    if (categoryNameExists) {
      throw new ConflictException('Категория с таким названием существует!');
    }

    const orderNumber = await this.prisma.category.findFirst({
      where: {
        order_number: data.order_number,
      },
    });

    if (orderNumber) {
      throw new ConflictException('Категория с данным номером уже существует!');
    }

    await this.prisma.category.create({
      data: {
        order_number: data.order_number,
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
        title_uz: data.title_uz,
        title_ru: data.title_ru,
        title_en: data.title_en,
        seo_title_uz: data.seo_title_uz,
        seo_title_ru: data.seo_title_ru,
        seo_title_en: data.seo_title_en,
        seo_description_uz: data.seo_description_uz,
        seo_description_ru: data.seo_description_ru,
        seo_description_en: data.seo_description_en,
        status: data?.status as Status,
      },
    });

    return 'Категория успешно создана!';
  }

  async update(id: number, data: UpdateCategoryDto) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!categoryExists) {
      throw new NotFoundException('Категория с указанным идентификатором не найдена!');
    }

    if (data.order_number) {
      const orderNumber = await this.prisma.category.findFirst({
        where: {
          order_number: data.order_number,
        },
      });

      if (orderNumber) {
        throw new ConflictException('Категория с данным номером уже существует!');
      }
    }

    await this.prisma.category.update({
      where: {
        id: categoryExists.id,
      },
      data: {
        order_number: data?.order_number ?? categoryExists?.order_number,
        name_uz: data?.name_uz ?? categoryExists?.name_uz,
        name_ru: data?.name_ru ?? categoryExists?.name_ru,
        name_en: data?.name_en ?? categoryExists?.name_en,
        title_uz: data?.title_uz ?? categoryExists?.title_uz,
        title_ru: data?.title_ru ?? categoryExists?.title_ru,
        title_en: data?.title_en ?? categoryExists?.title_en,
        seo_title_uz: data?.seo_title_uz ?? categoryExists?.seo_title_uz,
        seo_title_ru: data?.seo_title_ru ?? categoryExists?.seo_title_ru,
        seo_title_en: data?.seo_title_en ?? categoryExists?.seo_title_en,
        seo_description_uz: data?.seo_description_uz ?? categoryExists?.seo_description_uz,
        seo_description_ru: data?.seo_description_ru ?? categoryExists?.seo_description_ru,
        seo_description_en: data?.seo_description_en ?? categoryExists?.seo_description_en,
        status: (data?.status as Status) ?? categoryExists?.status,
        updated_at: new Date(),
      },
    });

    return 'Категория успешно обновлена!';
  }

  async remove(id: number) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        news: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!categoryExists) {
      throw new NotFoundException('Категория с указанным идентификатором не найдена!');
    }

    if (categoryExists.news.length) {
      throw new ConflictException('В этой категории есть новости и теперь их нельзя удалить!');
    }
    await this.prisma.category.delete({
      where: {
        id: categoryExists.id,
      },
    });

    return 'Категория успешно удалена!';
  }
}
