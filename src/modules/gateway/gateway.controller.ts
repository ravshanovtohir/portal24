import { Body, Controller, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('gateway')
export class GatewatController {
  constructor(private service: GatewayService) {}

  @Post('')
  gateway(@Body() body) {
    return this.service.gateway(body);
  }
}
