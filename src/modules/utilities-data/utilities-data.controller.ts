import { Controller, Get, Post } from '@nestjs/common';
import { UtilitiesDataService } from './utilities-data.service';
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

  @Post('update-weather')
  async updateWaetherinfos() {
    return this.utilitiesDataService.weatheroDb();
  }
}
