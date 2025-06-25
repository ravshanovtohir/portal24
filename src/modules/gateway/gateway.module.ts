import { Global, Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { GatewatController } from './gateway.controller';
import { NewsModule } from '@modules';

@Global()
@Module({
  imports: [NewsModule],
  controllers: [GatewatController],
  providers: [GatewayGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
