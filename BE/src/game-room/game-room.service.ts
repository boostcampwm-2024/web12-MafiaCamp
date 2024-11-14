import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { GameRoom } from './entity/game-room.model';
import { EventClient } from 'src/event/event-client.model';
import { GameClient } from './entity/game-client.model';
import { GameChat } from './entity/game-chat.model';
import {
  VIDEO_SERVER_USECASE,
  VideoServerUsecase,
} from 'src/video-server/usecase/video-server.usecase';
import { OpenViduRoleType } from 'src/video-server/types/openvidu.type';

@Injectable()
export class GameRoomService {
  private rooms: GameRoom[] = [];

  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
  ) {}

  getRooms() {
    return this.rooms.map((r) => r.toResponse());
  }

  createRoom(createRoomRequest: CreateRoomRequest) {
    this.rooms.push(GameRoom.from(createRoomRequest));
  }

  enterRoom(client: EventClient, roomId: string) {
    this.findRoomById(roomId).enter(new GameClient(client));
  }

  sendChat(roomId: string, chat: GameChat) {
    this.findRoomById(roomId).sendAll('chat', chat);
  }

  findRoomById(roomId: string) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }

  async startGame(roomId: string) {
    const room = this.findRoomById(roomId);
    const sessionId = await this.videoServerUseCase.createSession(roomId);

    const generateToken = async (
      roomId: string,
      userId: string,
      role: OpenViduRoleType,
      nickname?: string,
    ): Promise<string> => {
      return await this.videoServerUseCase.generateToken(
        roomId,
        userId,
        role,
        nickname,
      );
    };

    await room.startGame(sessionId, generateToken);
  }
}
