import { EventClient } from 'src/event/event-client.model';
import { MAFIA_ROLE } from 'src/game/mafia-role';

export class GameClient {
  private _job: MAFIA_ROLE;

  constructor(private readonly _client: EventClient) {}

  get client(): EventClient {
    return this._client;
  }

  get job() {
    return this._job;
  }

  set job(job: MAFIA_ROLE) {
    this._job = job;
  }

  send(event, ...args) {
    this._client.emit(event, ...args);
  }

  get nickname() {
    return this._client.nickname;
  }
}
