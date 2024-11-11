import { Socket } from 'socket.io';
import { EventManager, Subscription } from './event-manager';

export class EventClient {
  private readonly subscriptions: Subscription[] = [];
  private _nickname: string;

  constructor(
    private readonly socket: Socket,
    private readonly eventManager: EventManager,
  ) {}

  get nickname() {
    return this._nickname;
  }

  set nickname(nickname: string) {
    this._nickname = nickname;
  }

  emit(event: string, ...args) {
    this.socket.emit(event, ...args);
  }

  subscribe(eventName: string) {
    const handler = this.emit.bind(this);
    const subscription = this.eventManager.subscribe(eventName, (e) =>
      handler(e.event, e.data),
    );
    this.subscriptions.push(subscription);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
