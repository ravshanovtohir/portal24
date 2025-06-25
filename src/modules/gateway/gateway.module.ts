import { Global, Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { GatewatController } from './gateway.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '@prisma';

@Global()
@Module({
  imports: [UserModule, PrismaModule],
  controllers: [GatewatController],
  providers: [GatewayGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
