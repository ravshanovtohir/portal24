import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto';
import { IRequest } from '@interfaces';
import { JwtAuthGuard } from '@guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    return await this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() request: IRequest) {
    console.log(request);

    return await this.authService.getMe(request.user.id);
  }
}
