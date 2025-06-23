import { Global, Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { GatewatController } from './gateway.controller';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule],
  controllers: [GatewatController],
  providers: [GatewayGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
