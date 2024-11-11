import { EventClient } from "src/event/event-client.model";

export class GameClient {
  _roomId: string;

  constructor(
    private readonly client: EventClient
  ) {}

  set roomId(roomId) {
    this._roomId = roomId;
  }

  get roomId() {
    return this._roomId;
  }

  emit(d, ...args) {
    this.client.emit(d, ...args);
  }
}