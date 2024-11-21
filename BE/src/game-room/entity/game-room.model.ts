import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { GameRoomStatus } from './game-room.status';
import { GameClient } from './game-client.model';
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';
import { MAFIA_ROLE } from '../../game/mafia-role';

/**
 * 게임 참여자들의 소켓을 관리하며 게임 진행에 관련된 정보를 저장하는 세션 역할을 하는 클래스
 */
export class GameRoom {
  private _roomId: string = uuid();
  private _gameId: number = null;
  private participants = 0;
  private _status: GameRoomStatus = GameRoomStatus.READY;
  private createdAt: number = Date.now();
  private _result: GAME_HISTORY_RESULT = null;
  private _clients: GameClient[] = [];
  private readonly _mafias: GameClient[] = [];

  constructor(private title: string, private capacity: number) {}

  get roomId() {
    return this._roomId;
  }

  get gameId() {
    return this._gameId;
  }

  set gameId(gameId: number) {
    if (this._gameId) {
      throw new Error();
    }
    this._gameId = gameId;
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

  leave(nickname: string) {
    this._clients = this.clients.filter(c => c.nickname !== nickname);
    this.participants--;
    this.sendAll('leave-user-nickname', nickname);
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

  sendToRole(role: MAFIA_ROLE, event: string, ...args) {
    this._clients
      .filter((c) => c.job === role)
      .forEach((c) => {
        c.send(event, ...args);
      });
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
      status: this._status,
      createdAt: this.createdAt,
    };
  }

  private sendParticipantInfo() {
    const participants = this._clients.map((c) => c.nickname);
    this.sendAll('participants', participants);
  }
}
