import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto, UpdateDashboardDto, GetNewsDto } from './dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('news')
  async findAllNews(@Query() query: GetNewsDto) {
    return this.dashboardService.findAllNews(query);
  }
}
