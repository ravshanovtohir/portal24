import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto, GetLeadDto } from './dto';
import { paginate } from '@helpers';
import { PrismaService } from '@prisma';
import { Status } from '@prisma/client';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: GetLeadDto) {
    const leads = await paginate('lead', {
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
    return leads;
  }

  async findOne(id: number) {
    const lead = await this.prisma.lead.findUnique({
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

    if (!lead) {
      throw new NotFoundException('Лид с указанным идентификатором не найден!');
    }
    return lead;
  }

  async create(data: CreateLeadDto) {
    await this.prisma.lead.create({
      data: {
        sender_name: data.sender_name,
        email: data.email,
        phone_number: data.phone_number,
        message: data.message,
      },
    });
    return 'Лид успешно создана!';
  }

  async changeStatus(id: number, status: string) {
    const lead = await this.prisma.lead.findUnique({
      where: {
        id: id,
      },
    });
    if (!lead) {
      throw new NotFoundException('Лид с указанным идентификатором не найден!');
    }

    if (lead.status == (status as Status)) {
      throw new BadRequestException(`Статус лида уже ${status}`);
    }

    await this.prisma.lead.update({
      where: {
        id: lead.id,
      },
      data: {
        status: status as Status,
      },
    });

    return 'Статус лида успешно обновлен!';
  }
}
