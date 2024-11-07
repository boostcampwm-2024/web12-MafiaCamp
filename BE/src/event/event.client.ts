import { Socket } from 'socket.io';

export class EventClient {
  nickname: string;
  _roomId: string;

  constructor(
    private readonly socket: Socket
  ) {}

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

  set roomId(roomId) {
    this._roomId = roomId;
  }

  get roomId() {
    return this._roomId;
  }

  emit(event, ...args) {
    this.socket.emit(event, ...args);
  }
}
