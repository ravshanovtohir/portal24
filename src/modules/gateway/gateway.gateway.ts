import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ViewDto } from './dto';
import { GatewayService } from './gateway.service';
// import { SaveEveryCashRequest } from '@interfaces';

@WebSocketGateway()
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gatewayService: GatewayService) {}
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    // console.log(client, args);

    this.server.to(client.id).emit('success', {
      message: 'Successfully',
    });
  }

  handleDisconnect(client: any) {
    console.log(client);
  }

  @SubscribeMessage('view')
  async action(@MessageBody() body: ViewDto) {
    return await this.gatewayService.inceaseView(body.news_id);
  }

  // @SubscribeMessage('action')
  // async action(@MessageBody() body: SaveEveryCashRequest, @ConnectedSocket() client: Socket) {
  //   console.log(body, body.deviceId);
  //   if (body.deviceId) {
  //     for (const action of body.action) {
  //       if (action.type == 'CashEventResponse') {
  //         await this.kioskService.updateKioskUpdateBalance(body.deviceId, action);
  //       }
  //     }
  //   }
  // }
}
