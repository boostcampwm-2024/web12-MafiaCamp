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
import { Inject, Logger } from '@nestjs/common';
import { EventClient } from './event-client.model';
import { EventManager } from './event-manager';
import { Event } from './event.const';
import { START_GAME_USECASE, StartGameUsecase } from 'src/game/usecase/start-game/start-game.usecase';
import { VOTE_MAFIA_USECASE, VoteMafiaUsecase } from '../game/usecase/vote-manager/vote.mafia.usecase';
import { VoteCandidateRequest } from '../game/dto/vote.candidate.request';

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
    private readonly eventManager: EventManager,
    private readonly gameRoomService: GameRoomService,
    @Inject(START_GAME_USECASE)
    private readonly startGameUsecase: StartGameUsecase,
    @Inject(VOTE_MAFIA_USECASE)
    private readonly voteMafiaUsecase: VoteMafiaUsecase,
  ) {
  }

  handleConnection(socket: Socket) {
    this.logger.log(`client connected: ${socket.id}`);
    const client = new EventClient(socket, this.eventManager);
    client.subscribe(Event.ROOM_DATA_CHANGED);
    this.connectedClients.set(socket, client);
    this.publishRoomDataChangedEvent();
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
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const client = this.connectedClients.get(socket);
    this.gameRoomService.enterRoom(client, roomId);
    this.publishRoomDataChangedEvent();
  }

  @SubscribeMessage('send-chat')
  sendChatToRoom(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, message } = data;
    const room = this.gameRoomService.findRoomById(roomId);
    const client = this.connectedClients.get(socket);

    room.sendAll('chat', {
      from: client.nickname,
      to: 'room',
      message,
    });
  }

  @SubscribeMessage('send-mafia')
  sendMafia(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, message } = data;
    const room = this.gameRoomService.findRoomById(roomId);
    const client = this.connectedClients.get(socket);

    room.sendMafia('chat-mafia', {
      from: client.nickname,
      to: 'maifa',
      message,
    });
  }

  @SubscribeMessage('start-game')
  async startGame(@MessageBody('roomId') roomId: string) {
    const room = this.gameRoomService.findRoomById(roomId);
    if (!room.isFull()) {
      return {
        event: 'start-game',
        data: { success: false },
      };
    }
    this.startGameUsecase.start(room);
  }

  @SubscribeMessage('vote-candidate')
  async voteCandidate(@MessageBody() voteCandidateRequest: VoteCandidateRequest) {
    const room = this.gameRoomService.findRoomById(voteCandidateRequest.roomId);
    await this.voteMafiaUsecase.vote(room, voteCandidateRequest.from, voteCandidateRequest.to);
  }

  @SubscribeMessage('cancel-vote-candidate')
  async cancelVoteCandidate(@MessageBody() voteCandidateRequest: VoteCandidateRequest) {
    const room = this.gameRoomService.findRoomById(voteCandidateRequest.roomId);
    await this.voteMafiaUsecase.cancelVote(room, voteCandidateRequest.from, voteCandidateRequest.to);
  }

  private publishRoomDataChangedEvent() {
    this.eventManager.publish(Event.ROOM_DATA_CHANGED, {
      event: 'room-list',
      data: this.gameRoomService.getRooms(),
    });
  }
}
