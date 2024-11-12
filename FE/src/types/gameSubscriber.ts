import { Subscriber } from 'openvidu-browser';

export interface GameSubscriber {
  participant: Subscriber;
  audioEnabled: boolean;
  videoEnabled: boolean;
}
