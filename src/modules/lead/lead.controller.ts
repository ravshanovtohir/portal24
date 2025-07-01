import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto, GetLeadDto } from './dto';
import { ParamId } from '@enums';

@Controller('lid')
export class LidController {
  constructor(private readonly leadService: LeadService) {}
  @Get()
  async findAll(@Query() query: GetLeadDto) {
    return this.leadService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() param: ParamId) {
    return this.leadService.findOne(param.id);
  }

  @Post()
  async create(@Body() createLidDto: CreateLeadDto) {
    return this.leadService.create(createLidDto);
  }

  @Patch('update-status/:id')
  async changeLeadStatus(@Param() param: ParamId, @Query('status') status: string) {
    return this.leadService.changeStatus(param.id, status);
  }
}
