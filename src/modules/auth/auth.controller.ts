import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto';
import { IRequest } from '@interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginRequestDto) {
    return await this.authService.login(data);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() request: IRequest) {
    return await this.authService.getMe(request.user.id);
  }
}
