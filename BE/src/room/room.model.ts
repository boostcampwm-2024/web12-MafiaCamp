import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateRoomRequest } from './dto/create-room.request';
import { RoomStatus } from './room-status';
import { EventClient } from 'src/event/event.client';

export class Room {
  roomId: string = uuid();
  participants = 0; // 방 참가자 수
  status: RoomStatus = RoomStatus.READY;
  createdAt: number = Date.now();
  clients: EventClient[] = [];

  constructor(
    readonly title: string,
    readonly capacity: number
  ) {
  }

  static from(createRoomRequest: CreateRoomRequest) {
    const { title, capacity } = createRoomRequest;
    return new Room(title, capacity);
  }

  enter(client: EventClient) {
    if (this.capacity === this.participants) {
      throw new BadRequestException(); // todo: 적절한 예외 클래스 사용
    }
    this.clients.push(client); // 불변 업데이트?
    client.roomId = this.roomId;
    this.participants++;
  }

  sendAll(client: EventClient, message: string) {
    this.clients.forEach((c) => c.emit('chat', {
      from: client.nickname,
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
