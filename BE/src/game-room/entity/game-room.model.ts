import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { GameRoomStatus } from './game-room.status';
import { GameClient } from './game-client.model';
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';

export class GameRoom {
  private _roomId: string = uuid();
  private participants = 0;
  private _status: GameRoomStatus = GameRoomStatus.READY;
  private createdAt: number = Date.now();
  private _result: GAME_HISTORY_RESULT = null;
  private readonly _clients: GameClient[] = [];
  private readonly _mafias: GameClient[] = [];

  constructor(private title: string, private capacity: number) {}

  get roomId() {
    return this._roomId;
  }

  get clients(): GameClient[] {
    return this._clients;
  }

  get result(): GAME_HISTORY_RESULT {
    return this._result;
  }

  set result(result: GAME_HISTORY_RESULT) {
    this._result = result;
  }

  set status(status: GameRoomStatus) {
    this._status = status;
  }

  static of(title: string, capacity: number) {
    return new GameRoom(title, capacity);
  }

  enter(client: GameClient) {
    if (this.participants >= this.capacity) {
      throw new BadRequestException(); // todo: 적절한 예외 클래스 사용
    }
    this.participants++;
    this._clients.push(client);
    this.sendParticipantInfo();
  }

  sendAll(event: string, ...args) {
    this._clients.forEach((c) => c.send(event, ...args));
  }

  addMafia(mafia: GameClient) {
    this._mafias.push(mafia);
  }

  sendMafia(event: string, ...args) {
    this._mafias.forEach((m) => m.send(event, ...args));
  }

  isFull() {
    return this.participants === this.capacity;
  }
  
  toResponse() {
    return {
      roomId: this._roomId,
      title: this.title,
      capacity: this.capacity,
      participants: this.participants,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  private sendParticipantInfo() {
    const participants = this._clients.map((c) => c.nickname);
    this.sendAll('participants', participants);
  }
}
