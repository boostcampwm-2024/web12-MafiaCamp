import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateRoomRequest } from '../dto/create-room.request';
import { RoomStatus } from './room-status';
import { GameClient } from './game-client.model';

export class GameRoom {
  roomId: string = uuid();
  participants = 0; // 방 참가자 수
  status: RoomStatus = RoomStatus.READY;
  createdAt: number = Date.now();
  clients: GameClient[] = [];

  constructor(
    readonly title: string,
    readonly capacity: number
  ) {
  }

  static from(createRoomRequest: CreateRoomRequest) {
    const { title, capacity } = createRoomRequest;
    return new GameRoom(title, capacity);
  }

  enter(client: GameClient) {
    if (this.participants >= this.capacity) {
      throw new BadRequestException(); // todo: 적절한 예외 클래스 사용
    }
    client.roomId = this.roomId;
    this.clients.push(client);
    this.participants++;
  }

  sendAll(client: GameClient, message: string) {
    this.clients.forEach((c) => c.emit('chat', {
      from: 'dd', // client.nickname,
      to: 'room',
      message
    }));
  }

  toResponse() {
    return {
      roomId: this.roomId,
      title: this.title,
      capacity: this.capacity,
      participants: this.participants,
      status: this.status,
      createdAt: this.createdAt
    }
  }
}
