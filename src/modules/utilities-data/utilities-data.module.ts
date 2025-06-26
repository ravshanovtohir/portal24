import { Module } from '@nestjs/common';
import { UtilitiesDataService } from './utilities-data.service';
import { UtilitiesDataController } from './utilities-data.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [UtilitiesDataController],
  providers: [UtilitiesDataService],
})
export class UtilitiesDataModule {}
