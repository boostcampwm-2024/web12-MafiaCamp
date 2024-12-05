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
    subscribers[eventName].forEach((subscriber) => subscriber(e));
  }

  subscribe(eventName: string, handler: Subscriber): Subscription {
    const subscribers = this.subscribers;
    if (!subscribers[eventName]) {
      subscribers[eventName] = [];
    }
    subscribers[eventName].push(handler);

    return {
      unsubscribe() {
        subscribers[eventName] = subscribers[eventName].filter(
          (subscriber) => subscriber !== handler,
        );
      },
    };
  }
}
