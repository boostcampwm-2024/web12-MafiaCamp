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
  private _createdAt: number = Date.now();
  private _result: GAME_HISTORY_RESULT = null;
  private _clients: GameClient[] = [];

  constructor(
    private owner: string,
    private _title: string,
    private _capacity: number,
  ) {
  }

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

  get createdAt(): number {
    return this._createdAt;
  }

  get capacity(): number {
    return this._capacity;
  }

  get title(): string {
    return this._title;
  }

  get result(): GAME_HISTORY_RESULT {
    return this._result;
  }

  set result(result: GAME_HISTORY_RESULT) {
    this._result = result;
  }

  get status() {
    return this._status;
  }

  set status(status: GameRoomStatus) {
    this._status = status;
  }

  static of(owner: string, title: string, capacity: number) {
    return new GameRoom(owner, title, capacity);
  }

  reset() {
    this._gameId = null;
    this._status = GameRoomStatus.READY;
    this._result = null;
  }

  enter(client: GameClient) {
    if (this.participants >= this._capacity) {
      throw new BadRequestException(); // todo: 적절한 예외 클래스 사용
    }
    this.participants++;
    this._clients.push(client);
    this.sendParticipantInfo();
  }

  leave(nickname: string) {
    this.participants--;
    if (this.participants === 0) {
      this._status = GameRoomStatus.DONE;
      return;
    }
    this._clients = this.clients.filter((c) => c.nickname !== nickname);
    let newOwner = null;
    if (nickname === this.owner) {
      newOwner = this.delegateOwner();
      this.owner = newOwner;
    }
    this.sendAll('leave-user-nickname', {
      nickname,
      newOwner
    });
  }

  sendAll(event: string, ...args) {
    this._clients.forEach((c) => c.send(event, ...args));
  }

  sendToRole(role: MAFIA_ROLE, event: string, ...args) {
    this._clients
      .filter((c) => c.job === role)
      .forEach((c) => {
        c.send(event, ...args);
      });
  }

  isFull() {
    return this.participants === this._capacity;
  }

  toResponse() {
    return {
      roomId: this._roomId,
      owner: this.owner,
      title: this._title,
      capacity: this._capacity,
      participants: this.participants,
      status: this._status,
      createdAt: this._createdAt,
    };
  }

  getParticipants() {
    return this._clients.map((c) => ({
      nickname: c.nickname,
      isOwner: this.owner === c.nickname,
    }));
  }

  private sendParticipantInfo() {
    this.sendAll('participants', this.getParticipants());
  }

  private delegateOwner() {
    const length = this._clients.length;
    const randIdx = Math.floor(Math.random() * length);
    return this._clients[randIdx].nickname;
  }
}
