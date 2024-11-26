import { Socket } from 'socket.io';
import { EventManager, Subscriber, Subscription } from './event-manager';

export class EventClient {
  private readonly subscriptions: Subscription[] = [];
  private _nickname: string;
  private _tmpUserId: number;
  constructor(
    private readonly _socket: Socket,
    private readonly eventManager: EventManager,
  ) {}

  get nickname() {
    return this._nickname;
  }

  set nickname(nickname: string) {
    this._nickname = nickname;
  }

  get tmpUserId() {
    return this._tmpUserId;
  }
  set tmpUserId(userId: number) {
    this._tmpUserId = userId;
  }

  get socket(): Socket {
    return this._socket;
  }

  on(event: string, listener) {
    this._socket.on(event, listener);
  }

  once(event: string, listener) {
    this._socket.once(event, listener);
  }

  removeListener(event: string, listener) {
    this._socket.removeListener(event, listener);
  }

  emit(event: string, ...args) {
    this._socket.emit(event, ...args);
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
