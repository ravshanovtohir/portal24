import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilitiesDataService } from './utilities-data.service';
import { CreateUtilitiesDatumDto } from './dto/create-utilities-datum.dto';
import { UpdateUtilitiesDatumDto } from './dto/update-utilities-datum.dto';

@Controller('utilities-data')
export class UtilitiesDataController {
  constructor(private readonly utilitiesDataService: UtilitiesDataService) {}

  @Post()
  create(@Body() createUtilitiesDatumDto: CreateUtilitiesDatumDto) {
    return this.utilitiesDataService.create(createUtilitiesDatumDto);
  }

  @Get()
  findAll() {
    return this.utilitiesDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilitiesDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUtilitiesDatumDto: UpdateUtilitiesDatumDto) {
    return this.utilitiesDataService.update(+id, updateUtilitiesDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilitiesDataService.remove(+id);
  }
}
