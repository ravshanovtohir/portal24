import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LidService } from './lid.service';
import { CreateLidDto, GetLidDto } from './dto';
import { ParamId } from '@enums';

@Controller('lid')
export class LidController {
  constructor(private readonly lidService: LidService) {}
  @Get()
  async findAll(@Query() query: GetLidDto) {
    return this.lidService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() param: ParamId) {
    return this.lidService.findOne(param.id);
  }

  @Post()
  create(@Body() createLidDto: CreateLidDto) {
    return this.lidService.create(createLidDto);
  }
}
