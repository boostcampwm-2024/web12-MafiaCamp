import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { GameRoom } from './entity/game-room.model';
import { EventClient } from 'src/event/event-client.model';
import { GameClient } from './entity/game-client.model';
import { GameChat } from './entity/game-chat.model';

@Injectable()
export class GameRoomService {
  private rooms: GameRoom[] = [];

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
}
