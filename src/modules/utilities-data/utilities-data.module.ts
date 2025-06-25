import { Module } from '@nestjs/common';
import { UtilitiesDataService } from './utilities-data.service';
import { UtilitiesDataController } from './utilities-data.controller';

@Module({
  controllers: [UtilitiesDataController],
  providers: [UtilitiesDataService],
})
export class UtilitiesDataModule {}
