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
// import { SaveEveryCashRequest } from '@interfaces';

@WebSocketGateway()
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // constructor(private kioskService: KioskService) {}
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
