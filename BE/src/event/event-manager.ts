import { Injectable } from '@nestjs/common';

export type SocketEvent = {
  event: string;
  data: any;
};

export type Subscriber = (e: SocketEvent) => void;

export type Subscription = {
  unsubscribe: () => void;
};

@Injectable()
export class EventManager {
  private readonly subscribers: Record<string, Subscriber[]> = {};

  // todo: 비동기로 만들기
  publish(eventName: string, e: SocketEvent) {
    const subscribers = this.subscribers;
    if (!subscribers[eventName]) {
      return;
    }
    subscribers[eventName].forEach((handler) => handler(e));
  }

  subscribe(eventName: string, handler: Subscriber): Subscription {
    const subscribers = this.subscribers;
    if (!subscribers[eventName]) {
      subscribers[eventName] = [];
    }
    const index = subscribers[eventName].push(handler) - 1;

    return {
      unsubscribe() {
        subscribers[eventName].splice(index, 1);
      },
    };
  }
}
