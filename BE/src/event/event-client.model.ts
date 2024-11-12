import { Socket } from 'socket.io';
import { EventManager, Subscriber, Subscription } from './event-manager';

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
    const handler: Subscriber = (e) => this.emit(e.event, e.data);
    const subscription = this.eventManager.subscribe(eventName, handler);
    this.subscriptions.push(subscription);
  }

  unsubscribeAll() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
