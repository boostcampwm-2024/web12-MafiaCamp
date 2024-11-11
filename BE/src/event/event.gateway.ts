import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateRoomRequest } from 'src/game-room/dto/create-room.request';
import { GameRoomService } from 'src/game-room/game-room.service';
import { Inject, Logger, UseInterceptors } from '@nestjs/common';
import { WebsocketLoggerInterceptor } from 'src/common/logger/websocket.logger.interceptor';
import {
  VIDEO_SERVER_USECASE,
  VideoServerUsecase,
} from 'src/video-server/usecase/video-server.usecase';
import { EventClient } from './event-client.model';
import { OpenViduRole } from 'openvidu-node-client';
import { EventManager } from './event-manager';

// @UseInterceptors(WebsocketLoggerInterceptor)
@WebSocketGateway({
  namespace: 'ws',
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(EventGateway.name);
  private connectedClients: Map<Socket, EventClient> = new Map();

  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
    private readonly eventManager: EventManager,
    private readonly gameRoomService: GameRoomService,
  ) {}

  handleConnection(socket: Socket) {
    this.logger.log(`client connected: ${socket.id}`);
    const client = new EventClient(socket, this.eventManager);
    client.subscribe('RoomDataChanged');
    this.connectedClients.set(socket, client);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`client disconnected: ${socket.id}`);
    const client = this.connectedClients.get(socket);
    client.unsubscribeAll();
    this.connectedClients.delete(socket);
  }

  @SubscribeMessage('set-nickname')
  setNickname(
    @MessageBody() data: { nickname: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { nickname } = data;
    const client = this.connectedClients.get(socket);
    client.nickname = nickname;
  }

  @SubscribeMessage('room-list')
  getRooms(): WsResponse<any> {
    return {
      event: 'room-list',
      data: this.gameRoomService.getRooms(),
    };
  }

  @SubscribeMessage('create-room')
  createRoom(@MessageBody() createRoomRequest: CreateRoomRequest) {
    this.gameRoomService.createRoom(createRoomRequest);
    this.publishRoomDataChangedEvent();

    return {
      event: 'create-room',
      data: {
        success: true,
      },
    };
  }

  @SubscribeMessage('enter-room')
  enterRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId } = data;
    const client = this.connectedClients.get(socket);
    this.gameRoomService.enterRoom(client, roomId);
    this.publishRoomDataChangedEvent();
  }

  @SubscribeMessage('send-chat')
  sendChatToRoom(
    @MessageBody() data: { roomId: string, message: string },
    @ConnectedSocket() socket: Socket
  ) {
    const { roomId, message } = data;
    const client = this.connectedClients.get(socket);
    this.gameRoomService.sendChat(roomId, {
      from: client.nickname,
      to: 'room',
      message
    });
  }

  // @SubscribeMessage('start-game')
  // async startGame(@ConnectedSocket() socket: Socket) {
  //   const roomId = this.connectedClients.get(socket).roomId;
  //   const sessionId = await this.videoServerUseCase.createSession(roomId);
  //   const room = this.roomService.findRoomById(roomId);
  //   room.clients.forEach(async c => {
  //     const token = await this.videoServerUseCase.generateToken(roomId, c.nickname, OpenViduRole.PUBLISHER);
  //     c.emit('video-info', {
  //       token,
  //       sessionId
  //     });
  //   })
  // }

  private publishRoomDataChangedEvent() {
    this.eventManager.publish('RoomDataChanged', {
      event: 'room-list',
      data: this.gameRoomService.getRooms()
    });
  }
}
