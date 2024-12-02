import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomRequest } from './dto/create-room.request';
import { GameRoom } from './entity/game-room.model';
import { EventClient } from 'src/event/event-client.model';
import { GameClient } from './entity/game-client.model';
import { GameRoomStatus } from './entity/game-room.status';

@Injectable()
export class GameRoomService {
  private rooms: GameRoom[] = [];

  findVacantRoomId(): Record<string, any> {
    const vacantRoom = this.rooms
      .filter((gameRoom) => !gameRoom.isFull())
      .sort((a, b) => a.createdAt - b.createdAt)[0];
    if (!vacantRoom) {
      return {
        'roomId': null,
        'capacity': null,
        'title': null,
      };
    }
    return {
      'roomId': vacantRoom.roomId,
      'capacity': vacantRoom.capacity,
      'title': vacantRoom.title,
    };
  }

  getRooms() {
    return this.rooms.map((r) => r.toResponse());
  }

  createRoom(
    client: EventClient,
    createRoomRequest: CreateRoomRequest,
  ): string {
    const { title, capacity } = createRoomRequest;
    const room = GameRoom.of(client.nickname, title, capacity);
    this.rooms.push(room);
    return room.roomId;
  }

  enterRoom(client: EventClient, roomId: string) {
    this.findRoomById(roomId).enter(new GameClient(client));
  }

  leaveRoom(nickname: string, roomId: string) {
    const room = this.findRoomById(roomId);
    room.leave(nickname);
    if (room.status === GameRoomStatus.DONE) {
      this.rooms = this.rooms.filter((r) => r.roomId !== roomId);
    }
  }

  getParticipants(roomId: string): { nickname: string, isOwner: boolean }[] {
    const room = this.findRoomById(roomId);
    return room.getParticipants();
  }

  findRoomById(roomId: string) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }
}
