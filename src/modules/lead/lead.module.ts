import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LidController } from './lead.controller';
import { PrismaModule } from '@prisma';

@Module({
  imports: [PrismaModule],
  controllers: [LidController],
  providers: [LeadService],
})
export class LeadModule {}
