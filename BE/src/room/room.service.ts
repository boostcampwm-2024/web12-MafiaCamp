import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { Room } from './room.model';
import { EventClient } from 'src/event/event.client';

@Injectable()
export class RoomService {
  private rooms: Room[] = [];

  getRooms() {
    return this.rooms.map((r) => r.toResponse());
  }

  createRoom(createRoomRequest: CreateRoomRequest) {
    const room = Room.from(createRoomRequest);
    this.rooms = [...this.rooms, room];
  }

  enterRoom(client: EventClient, roomId: string) {
    const room = this.findRoomById(roomId);
    room.enter(client);
  }

  sendAll(client: EventClient, message: string) {
    const room = this.findRoomById(client.roomId);
    room.sendAll(client, message);
  }

  findRoomById(roomId) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }
}
