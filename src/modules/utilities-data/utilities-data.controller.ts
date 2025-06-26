import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UtilitiesDataService } from './utilities-data.service';
import { CreateUtilitiesDatumDto } from './dto/create-utilities-datum.dto';
import { UpdateUtilitiesDatumDto } from './dto/update-utilities-datum.dto';
import { HeadersValidation } from '@decorators';
import { DeviceHeadersDto } from '@enums';

@Controller('utilities-data')
export class UtilitiesDataController {
  constructor(private readonly utilitiesDataService: UtilitiesDataService) {}

  @Get('weather')
  getWeather(@HeadersValidation() headers: DeviceHeadersDto) {
    return this.utilitiesDataService.getWeather(headers.lang);
  }

  @Get('currency')
  getValyuta(@HeadersValidation() headers: DeviceHeadersDto) {
    return this.utilitiesDataService.kursValyut(headers.lang);
  }
}
