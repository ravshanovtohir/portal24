import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto, GetStaffDto } from './dto';
import { ParamId } from '@enums';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async findAll(@Query() query: GetStaffDto) {
    return this.staffService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() param: ParamId) {
    return this.staffService.findOne(param.id);
  }

  @Post()
  async create(@Body() data: CreateStaffDto) {
    return this.staffService.create(data);
  }

  @Patch(':id')
  async update(@Param() param: ParamId, @Body() data: UpdateStaffDto) {
    return this.staffService.update(param.id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
