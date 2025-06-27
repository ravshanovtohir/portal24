import { Module } from '@nestjs/common';
import { UtilitiesDataService } from './utilities-data.service';
import { UtilitiesDataController } from './utilities-data.controller';
import { HttpModule } from '@nestjs/axios';
import { WinstonLoggerService } from '@logger';

@Module({
  imports: [HttpModule],
  controllers: [UtilitiesDataController],
  providers: [UtilitiesDataService, WinstonLoggerService],
})
export class UtilitiesDataModule {}
