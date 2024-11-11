import { EventClient } from "src/event/event-client.model";
import { MAFIA_ROLE } from "src/game/mafia-role";

export class GameClient {
  private _job: MAFIA_ROLE

  constructor(
    private readonly client: EventClient
  ) {}

  get job() {
    return this._job;
  }

  set job(job: MAFIA_ROLE) {
    this._job = job;
  }

  send(event, ...args) {
    this.client.emit(event, ...args);
  }

  getNickname() {
    return this.client.nickname;
  }
}