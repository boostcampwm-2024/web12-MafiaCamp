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

  on(event: string, listener) {
    this._client.on(event, listener);
  }

  once(event: string, listener) {
    this._client.once(event, listener);
  }

  removeListener(event: string, listener) {
    this._client.removeListener(event, listener);
  }

  send(event: string, ...args) {
    this._client.emit(event, ...args);
  }

  get nickname() {
    return this._client.nickname;
  }
}
