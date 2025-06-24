import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
        name_uz: true,
        name_ru: true,
        name_en: true,
        status: true,
        created_at: true,
      },
    });

    return categories;
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name_uz: true,
        name_ru: true,
        name_en: true,
        status: true,
        created_at: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Категория с указанным идентификатором не найдена!');
    }

    return {
      status: HttpStatus.OK,
      data: category,
    };
  }

  async create(data: CreateCategoryDto) {
    await this.prisma.category.create({
      data: {
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
        status: data?.status as Status,
      },
    });

    return {
      status: HttpStatus.CREATED,
    };
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

    await this.prisma.category.update({
      where: {
        id: categoryExists.id,
      },
      data: {
        name_uz: data?.name_uz ?? categoryExists?.name_uz,
        name_ru: data?.name_ru ?? categoryExists?.name_ru,
        name_en: data?.name_en ?? categoryExists?.name_en,
        status: (data?.status as Status) ?? categoryExists?.status,
      },
    });

    return {
      status: HttpStatus.OK,
    };
  }

  async remove(id: number) {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!categoryExists) {
      throw new NotFoundException('Категория с указанным идентификатором не найдена!');
    }
    await this.prisma.category.delete({
      where: {
        id: categoryExists.id,
      },
    });

    return {
      status: HttpStatus.NO_CONTENT,
    };
  }
}
