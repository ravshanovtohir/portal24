import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto, UpdateDashboardDto, GetNewsDto } from './dto';
import { HeadersValidation } from '@decorators';
import { DeviceHeadersDto, ParamId } from '@enums';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('news')
  async findAllNews(@Query() query: GetNewsDto, @HeadersValidation() headers: DeviceHeadersDto) {
    return this.dashboardService.findAllNews(query, headers.lang);
  }

  @Get('news/:id')
  async getNewsById(@Param() param: ParamId) {
    return this.dashboardService.getNewsById(param.id);
  }

  @Get('category')
  async findCategory() {
    return this.dashboardService.findCategory();
  }
}
