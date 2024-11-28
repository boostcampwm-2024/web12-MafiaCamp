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
import { Inject, Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { EventClient } from './event-client.model';
import { EventManager } from './event-manager';
import { Event } from './event.const';
import { START_GAME_USECASE, StartGameUsecase } from 'src/game/usecase/start-game/start-game.usecase';
import { VOTE_MAFIA_USECASE, VoteMafiaUsecase } from '../game/usecase/vote-manager/vote.mafia.usecase';
import { VoteCandidateRequest } from '../game/dto/vote.candidate.request';
import { SelectMafiaTargetRequest } from '../game/dto/select.mafia.target.request';
import { MAFIA_KILL_USECASE, MafiaKillUsecase } from '../game/usecase/role-playing/mafia.kill.usecase';
import { DOCTOR_CURE_USECASE, DoctorCureUsecase } from '../game/usecase/role-playing/doctor.cure.usecase';
import { WebsocketLoggerInterceptor } from '../common/logger/websocket.logger.interceptor';
import { WebsocketExceptionFilter } from '../common/filter/websocket.exception.filter';
import { FIND_USERINFO_USECASE, FindUserInfoUsecase } from 'src/user/usecase/find.user-info.usecase';
import { LOGOUT_USECASE, LogoutUsecase } from '../user/usecase/logout.usecase';
import { LogoutRequest } from '../user/dto/logout.request';
import { RECONNECT_USER_USECASE, ReconnectUserUsecase } from '../user/usecase/reconnect.user.usecase';
import { ReconnectUserRequest } from '../user/dto/reconnect.user.request';


@UseFilters(WebsocketExceptionFilter)
@UseInterceptors(WebsocketLoggerInterceptor)
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
    @Inject(MAFIA_KILL_USECASE)
    private readonly mafiaKillUseCase: MafiaKillUsecase,
    @Inject(DOCTOR_CURE_USECASE)
    private readonly doctorCureUsecase: DoctorCureUsecase,
    @Inject(FIND_USERINFO_USECASE)
    private readonly findUserInfoUsecase: FindUserInfoUsecase,
    @Inject(LOGOUT_USECASE)
    private readonly logoutUsecase: LogoutUsecase,
    @Inject(RECONNECT_USER_USECASE)
    private readonly reconnectUserUsecase: ReconnectUserUsecase,
  ) {
  }

  async handleConnection(socket: Socket) {
    this.logger.log(`[${socket.id}] Client connected`);
    const headers = socket.handshake.headers;
    const token = this.parseToken(headers);
    if (!token) {
      this.logger.log(`[${socket.id}] Unauthorized client`);
      // todo: socket 연결 강제로 끊기
      return;
    }
    const { nickname, userId } = await this.findUserInfoUsecase.find(token);
    this.reconnectUserUsecase.reconnect(new ReconnectUserRequest(userId, nickname));
    const client = new EventClient(socket, this.eventManager);
    client.nickname = nickname;
    client.userId = userId;
    client.subscribe(Event.ROOM_DATA_CHANGED);
    this.connectedClients.set(socket, client);
    this.publishRoomDataChangedEvent();
  }

  private parseToken(headers): string {
    const cookies = headers.cookie?.split(';').map((keyVal) => keyVal.split('=')).reduce((cookies, [key, val]) => {
      cookies[key.trim()] = val.trim();
      return cookies;
    }, {});
    return cookies?.access_token;
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`[${socket.id}] Client disconnected`);
    const client = this.connectedClients.get(socket);
    if (!client) {
      return;
    }
    const headers = socket.handshake.headers;
    const token = this.parseToken(headers);
    if (!token) {
      this.logger.log(`[${socket.id}] Unauthorized client`);
      // todo: socket 연결 강제로 끊기
      return;
    }
    const { _, userId } = await this.findUserInfoUsecase.find(token);
    this.logoutUsecase.logout(new LogoutRequest(userId));
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
  createRoom(
    @MessageBody() createRoomRequest: CreateRoomRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    const client = this.connectedClients.get(socket);
    const roomId = this.gameRoomService.createRoom(client, createRoomRequest);
    this.publishRoomDataChangedEvent();

    return {
      event: 'create-room',
      data: {
        success: true,
        roomId,
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

  @SubscribeMessage('leave-room')
  leaveRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const client = this.connectedClients.get(socket);
    this.gameRoomService.leaveRoom(client.nickname, roomId);
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
    await this.startGameUsecase.start(room);
  }

  @SubscribeMessage('vote-candidate')
  async voteCandidate(
    @MessageBody() voteCandidateRequest: VoteCandidateRequest,
  ) {
    const room = this.gameRoomService.findRoomById(voteCandidateRequest.roomId);
    await this.voteMafiaUsecase.vote(
      room,
      voteCandidateRequest.from,
      voteCandidateRequest.to,
    );
  }

  @SubscribeMessage('cancel-vote-candidate')
  async cancelVoteCandidate(
    @MessageBody() voteCandidateRequest: VoteCandidateRequest,
  ) {
    const room = this.gameRoomService.findRoomById(voteCandidateRequest.roomId);
    await this.voteMafiaUsecase.cancelVote(
      room,
      voteCandidateRequest.from,
      voteCandidateRequest.to,
    );
  }


  @SubscribeMessage('select-mafia-target')
  async selectMafiaTarget(
    @MessageBody() selectMafiaTargetRequest: SelectMafiaTargetRequest,
  ) {
    const room = this.gameRoomService.findRoomById(
      selectMafiaTargetRequest.roomId,
    );
    await this.mafiaKillUseCase.selectMafiaTarget(
      room,
      selectMafiaTargetRequest.from,
      selectMafiaTargetRequest.target,
    );
  }

  private publishRoomDataChangedEvent() {
    this.eventManager.publish(Event.ROOM_DATA_CHANGED, {
      event: 'room-list',
      data: this.gameRoomService.getRooms(),
    });
  }
}
