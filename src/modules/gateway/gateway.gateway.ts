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
import { NewsService } from '@modules';
// import { SaveEveryCashRequest } from '@interfaces';

@WebSocketGateway()
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private newsService: NewsService) {}
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
    const result = await this.newsService.newView(body.news_id);
    return result;
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
