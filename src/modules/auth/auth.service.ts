import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dto';
import { PrismaService } from '@prisma';
import { Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async validate(login: string) {
    const staff = await this.prisma.staff.findFirst({
      where: {
        login: login,
      },
      select: {
        id: true,
        login: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Пользователь не существует!');
    }

    if (staff.status !== Status.ACTIVE) {
      throw new UnauthorizedException('Пользователь имеет пассивный статус. Разрешено только активным пользователям!');
    }

    return {
      id: staff?.id,
      login: staff?.login,
      password: staff?.password,
      role: staff?.role,
    };
  }

  async login(data: LoginRequestDto) {
    const staff = await this.validate(data.login);

    if (!staff) {
      throw new NotFoundException('Логин неверный!');
    }

    const isMatch = await bcrypt.compare(data.password, staff.password);

    if (!isMatch) {
      throw new UnauthorizedException('Недействительные учетные данные!');
    }
    const accessToken = this.jwtService.sign({
      id: staff?.id,
      role: staff?.role,
      login: staff?.login,
    });

    return {
      accessToken: accessToken,
    };
  }

  async getMe(userId: number) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
        code: true,
        status: true,
      },
    });

    return staff;
  }
}
