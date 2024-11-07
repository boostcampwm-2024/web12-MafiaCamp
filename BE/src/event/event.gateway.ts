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
import { CreateRoomRequest } from 'src/room/dto/create-room.request';
import { RoomService } from 'src/room/room.service';
import { Inject, Logger, UseInterceptors } from '@nestjs/common';
import { WebsocketLoggerInterceptor } from 'src/common/logger/websocket.logger.interceptor';
import {
  VIDEO_SERVER_USECASE,
  VideoServerUsecase,
} from 'src/video-server/usecase/video-server.usecase';
import { EventClient } from './event.client';
import { OpenViduRole } from 'openvidu-node-client';

// @UseInterceptors(WebsocketLoggerInterceptor)
@WebSocketGateway({
  namespace: 'ws',
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(EventGateway.name);
  private connectedClients: Map<Socket, EventClient> = new Map();

  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
    private readonly roomService: RoomService,
  ) {}

  handleConnection(socket: Socket) {
    this.logger.log(`client connected: ${socket.id}`);
    this.connectedClients.set(socket, new EventClient(socket));
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`client disconnected: ${socket.id}`);
    this.connectedClients.delete(socket);
  }

  @SubscribeMessage('set-nickname')
  setNickname(
    @MessageBody() data: { nickname: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { nickname } = data;
    const client = this.connectedClients.get(socket);
    client.setNickname(nickname);
  }

  @SubscribeMessage('room-list')
  getRooms(): WsResponse<any> {
    return {
      event: 'room-list',
      data: this.roomService.getRooms(),
    };
  }

  @SubscribeMessage('create-room')
  createRoom(@MessageBody() createRoomRequest: CreateRoomRequest) {
    this.roomService.createRoom(createRoomRequest);
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
    this.roomService.enterRoom(client, roomId);
  }

  @SubscribeMessage('send-chat')
  messageRoom(
    @MessageBody() data: { message: string },
    @ConnectedSocket() socket: Socket
  ) {
    const { message } = data;
    const client = this.connectedClients.get(socket);
    this.roomService.sendAll(client, message);
  }

  @SubscribeMessage('start-game')
  async startGame(@ConnectedSocket() socket: Socket) {
    const roomId = this.connectedClients.get(socket).roomId;
    const sessionId = await this.videoServerUseCase.createSession(roomId);
    const room = this.roomService.findRoomById(roomId);
    room.clients.forEach(async c => {
      const token = await this.videoServerUseCase.generateToken(roomId, c.nickname, OpenViduRole.PUBLISHER);
      c.emit('video-info', {
        token,
        sessionId
      });
    })
  }
}
