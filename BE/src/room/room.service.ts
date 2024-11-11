import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { GameRoom } from './model/game-room.model';
import { EventClient } from 'src/event/event-client.model';
import { GameClient } from './model/game-client.model';

@Injectable()
export class RoomService {
  private rooms: GameRoom[] = [];

  getRooms() {
    return this.rooms.map((r) => r.toResponse());
  }

  createRoom(createRoomRequest: CreateRoomRequest) {
    const room = GameRoom.from(createRoomRequest);
    this.rooms = [...this.rooms, room];
  }

  enterRoom(client: EventClient, roomId: string) {
    this.findRoomById(roomId)
      .enter(new GameClient(client));
  }

  sendAll(client: EventClient, roomId: string, message: string) {
    this.findRoomById(roomId)
      .sendAll(new GameClient(client), message);
  }

  findRoomById(roomId) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }
}
