import { Injectable } from '@nestjs/common';
import { CreateLidDto, GetLidDto } from './dto';
import { paginate } from '@helpers';
import { PrismaService } from '@prisma';

@Injectable()
export class LidService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: GetLidDto) {
    const lids = await paginate('lid', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: {
        id: true,
        sender_name: true,
        email: true,
        phone_number: true,
        message: true,
        created_at: true,
      },
    });
    return lids;
  }

  async findOne(id: number) {
    const lid = await this.prisma.lid.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        sender_name: true,
        email: true,
        phone_number: true,
        message: true,
        created_at: true,
      },
    });
    return lid;
  }

  async create(data: CreateLidDto) {
    await this.prisma.lid.create({
      data: {
        sender_name: data.sender_name,
        email: data.email,
        phone_number: data.phone_number,
        message: data.message,
      },
    });
    return 'Лид успешно создана!';
  }
}
