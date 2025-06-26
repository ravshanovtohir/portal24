import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GetStaffDto, CreateStaffDto, UpdateStaffDto } from './dto';
import { PrismaService } from '@prisma';
import { paginate } from '@helpers';
import { StaffRole, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: GetStaffDto) {
    const stafs = await paginate('staff', {
      page: query?.page,
      size: query?.size,
      filter: query?.filters,
      sort: query?.sort,
      select: {
        id: true,
        login: true,
        name: true,
        code: true,
        createdAt: true,
      },
    });
    return stafs;
  }

  async findOne(id: number) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        login: true,
        name: true,
        role: true,
        code: true,
        createdAt: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Сотрудник с указанным идентификатором не найден!');
    }

    return staff;
  }

  async create(data: CreateStaffDto) {
    const saltOrRounds = 10;
    const user = await this.prisma.staff.findFirst({
      where: {
        login: data.login,
      },
    });

    if (user) {
      throw new ConflictException('Этот логин уже используется!');
    }

    const roleCapitalLetter = data?.role?.substring(0, 2).toUpperCase();
    const count: number = await this.prisma.user.count({
      where: {
        role: data.role as StaffRole,
      },
    });
    const code = `${roleCapitalLetter}${count + 1}`;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);

    await this.prisma.staff.create({
      data: {
        login: data.login,
        password: hashedPassword,
        role: data.role as StaffRole,
        status: data.status as Status,
        code: code,
      },
    });

    return 'Пользователь успешно создан!';
  }

  async update(id: number, data: UpdateStaffDto) {
    const saltOrRounds = 10;

    const staff = await this.prisma.staff.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        login: true,
        name: true,
        code: true,
        password: true,
        status: true,
        role: true,
        createdAt: true,
      },
    });

    const updatedUser: any = {};

    if (!staff) {
      throw new NotFoundException('Сотрудник с указанным идентификатором не найден!');
    }

    if (data.login) {
      const user = await this.prisma.staff.findFirst({
        where: {
          login: data.login,
        },
      });

      if (user) {
        throw new ConflictException('Этот логин уже используется!');
      }

      updatedUser.login = data.login;
    }

    if (data.role && staff.role !== data.role) {
      const roleCapitalLetter = data?.role?.substring(0, 2).toUpperCase();
      const count: number = await this.prisma.user.count({
        where: {
          role: data.role as StaffRole,
        },
      });
      const code = `${roleCapitalLetter}${count + 1}`;
      updatedUser.code = code;
      updatedUser.role = data.role;
    }

    await this.prisma.staff.update({
      where: {
        id: staff.id,
      },
      data: {
        login: updatedUser.login ?? staff.login,
        password: updatedUser.login ?? staff.login,
        role: updatedUser.login ?? staff.role,
        status: (data.status as Status) ?? staff.status,
        code: updatedUser.login ?? staff.code,
      },
    });

    return 'Пользователь успешно обновлен!';
  }

  async remove(id: number) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Сотрудник с указанным идентификатором не найден!');
    }

    await this.prisma.staff.update({
      where: {
        id: staff.id,
      },
      data: {
        status: Status.INACTIVE,
      },
    });
  }
}
