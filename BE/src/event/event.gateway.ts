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
import {
  START_GAME_USECASE,
  StartGameUsecase,
} from 'src/game/usecase/start-game/start-game.usecase';
import {
  VOTE_MAFIA_USECASE,
  VoteMafiaUsecase,
} from '../game/usecase/vote-manager/vote.mafia.usecase';
import { VoteCandidateRequest } from '../game/dto/vote.candidate.request';
import { SelectMafiaTargetRequest } from '../game/dto/select.mafia.target.request';
import {
  CONNECTED_USER_USECASE,
  ConnectedUserUsecase,
} from '../online-state/connected-user.usecase';
import {
  MAFIA_KILL_USECASE,
  MafiaKillUsecase,
} from '../game/usecase/role-playing/mafia.kill.usecase';
import { WebsocketLoggerInterceptor } from '../common/logger/websocket.logger.interceptor';
import { WebsocketExceptionFilter } from '../common/filter/websocket.exception.filter';
import {
  FIND_USERINFO_USECASE,
  FindUserInfoUsecase,
} from 'src/user/usecase/find.user-info.usecase';
import { LOGOUT_USECASE, LogoutUsecase } from '../user/usecase/logout.usecase';
import { LogoutRequest } from '../user/dto/logout.request';
import { EventClientManager } from './event-client-manager';

@UseFilters(WebsocketExceptionFilter)
@UseInterceptors(WebsocketLoggerInterceptor)
@WebSocketGateway({
  namespace: 'ws',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(EventGateway.name);

  constructor(
    private readonly eventManager: EventManager,
    private readonly eventClientManager: EventClientManager,
    private readonly gameRoomService: GameRoomService,
    @Inject(START_GAME_USECASE)
    private readonly startGameUsecase: StartGameUsecase,
    @Inject(VOTE_MAFIA_USECASE)
    private readonly voteMafiaUsecase: VoteMafiaUsecase,
    @Inject(MAFIA_KILL_USECASE)
    private readonly mafiaKillUseCase: MafiaKillUsecase,
    @Inject(FIND_USERINFO_USECASE)
    private readonly findUserInfoUsecase: FindUserInfoUsecase,
    @Inject(CONNECTED_USER_USECASE)
    private readonly connectUserUseCase: ConnectedUserUsecase,
    @Inject(LOGOUT_USECASE)
    private readonly logoutUsecase: LogoutUsecase,
  ) {}

  async handleConnection(socket: Socket) {
    this.logger.log(`[${socket.id}] Client connected`);
    const headers = socket.handshake.headers;
    const token = this.parseToken(headers);
    if (!token) {
      this.logger.log(`[${socket.id}] Unauthorized client`);
      // todo: socket 연결 강제로 끊기
      return;
    }
    const { nickname, userId } = await this.findUserInfoUsecase.findWs(token);
    const client = new EventClient(socket, this.eventManager);
    client.nickname = nickname;
    client.userId = userId;

    await this.connectUserUseCase.enter({
      userId: String(userId),
      nickname: nickname,
    });

    this.publishOnlineUserUpsertEvent(String(userId), nickname);

    // 유저 접속 시 현재 online userList를 전송
    const onLineUserList = await this.connectUserUseCase.getOnLineUserList();
    client.emit('online-user-list', onLineUserList);

    client.subscribe(Event.ROOM_DATA_CHANGED);
    client.subscribe(Event.USER_DATA_CHANGED);
    this.eventClientManager.addClient(socket, client);
    this.publishRoomDataChangedEvent();
  }

  private parseToken(headers): string {
    const cookies = headers.cookie
      ?.split(';')
      .map((keyVal) => keyVal.split('='))
      .reduce((cookies, [key, val]) => {
        cookies[key.trim()] = val.trim();
        return cookies;
      }, {});
    return cookies?.access_token;
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`[${socket.id}] Client disconnected`);
    const client = this.eventClientManager.getClientBySocket(socket);
    if (!client) {
      return;
    }
    this.logoutUsecase.logout(new LogoutRequest(client.userId));
    client.unsubscribeAll();
    await this.connectUserUseCase.leave(String(client.userId));
    this.publishOnlineUserExitEvent(String(client.userId));
    this.eventClientManager.removeClient(socket);
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
    const client = this.eventClientManager.getClientBySocket(socket);
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
  async enterRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const client = this.eventClientManager.getClientBySocket(socket);
    this.gameRoomService.enterRoom(client, roomId);

    await this.connectUserUseCase.enterRoom({
      userId: String(client.userId),
      nickname: client.nickname,
    });

    this.publishRoomDataChangedEvent();
    this.publishOnlineUserUpsertEvent(
      String(client.userId),
      client.nickname,
      false,
    );
  }

  @SubscribeMessage('leave-room')
  async leaveRoom(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const client = this.eventClientManager.getClientBySocket(socket);
    this.gameRoomService.leaveRoom(client.nickname, roomId);

    await this.connectUserUseCase.leaveRoom({
      userId: String(client.userId),
      nickname: client.nickname,
    });

    this.publishRoomDataChangedEvent();
    this.publishOnlineUserUpsertEvent(
      String(client.userId),
      client.nickname,
      true,
    );
  }

  @SubscribeMessage('get-participants')
  getParticipants(@MessageBody('roomId') roomId: string) {
    const participants = this.gameRoomService.getParticipants(roomId);
    return {
      event: 'participants',
      data: participants,
    };
  }

  @SubscribeMessage('send-chat')
  sendChatToRoom(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { roomId, message } = data;
    const room = this.gameRoomService.findRoomById(roomId);
    const client = this.eventClientManager.getClientBySocket(socket);

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
    const client = this.eventClientManager.getClientBySocket(socket);

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

  private publishOnlineUserUpsertEvent(
    userId: string,
    nickname: string,
    isInLobby = true,
  ) {
    this.eventManager.publish(Event.USER_DATA_CHANGED, {
      event: 'upsert-online-user',
      data: { userId, nickname, isInLobby },
    });
  }

  private publishOnlineUserExitEvent(userId: string) {
    this.eventManager.publish(Event.USER_DATA_CHANGED, {
      event: 'exit-online-user',
      data: { userId },
    });
  }
}
