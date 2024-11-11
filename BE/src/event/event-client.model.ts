import { Socket } from 'socket.io';
import { EventManager, Subscription } from './event-manager';

export class EventClient {
  private readonly subscriptions: Subscription[] = [];
  nickname: string;

  constructor(
    private readonly socket: Socket,
    private readonly eventManager: EventManager,
  ) {}
  
  emit(event: string, ...args) {
    this.socket.emit(event, ...args);
  }

  subscribe(eventName: string) {
    const subscription = this.eventManager.subscribe(eventName, (e) => this.emit.bind(this, e.name, e.data));
    this.subscriptions.push(subscription);
  }

  unsubscribeAll() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

}
