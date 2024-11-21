import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { GameRoom } from './entity/game-room.model';
import { EventClient } from 'src/event/event-client.model';
import { GameClient } from './entity/game-client.model';

@Injectable()
export class GameRoomService {
  private rooms: GameRoom[] = [];

  getRooms() {
    return this.rooms.map((r) => r.toResponse());
  }

  createRoom(client: EventClient, createRoomRequest: CreateRoomRequest): string {
    const { title, capacity } = createRoomRequest;
    const room = GameRoom.of(client.nickname, title, capacity)
    this.rooms.push(room);
    return room.roomId;
  }

  enterRoom(client: EventClient, roomId: string) {
    this.findRoomById(roomId).enter(new GameClient(client));
  }

  leaveRoom(nickname: string, roomId: string) {
    this.findRoomById(roomId).leave(nickname);
  }

  findRoomById(roomId: string) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }
}
