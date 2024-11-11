import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateRoomRequest } from '../dto/create-room.request';
import { GameRoomStatus } from './game-room.status';
import { GameClient } from './game-client.model';

export class GameRoom {
  private _roomId: string = uuid();
  private participants = 0;
  private status: GameRoomStatus = GameRoomStatus.READY;
  private createdAt: number = Date.now();
  private readonly clients: GameClient[] = [];

  constructor(
    private title: string,
    private capacity: number
  ) {}

  set roomId(roomId) {
    this._roomId = roomId;
  }

  get roomId() {
    return this._roomId;
  }

  static from(createRoomRequest: CreateRoomRequest) {
    const { title, capacity } = createRoomRequest;
    return new GameRoom(title, capacity);
  }

  enter(client: GameClient) {
    if (this.participants >= this.capacity) {
      throw new BadRequestException(); // todo: 적절한 예외 클래스 사용
    }
    this.participants++;
    this.clients.push(client);
    const participants = this.clients.map(c => c.getNickname())
    this.sendAll('participants', participants);
  }

  sendAll(event, ...args) {
    this.clients.forEach((c) => c.send(event, ...args));
  }

  toResponse() {
    return {
      roomId: this._roomId,
      title: this.title,
      capacity: this.capacity,
      participants: this.participants,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}
