import { Subscriber } from 'openvidu-browser';

export interface GameSubscriber {
  participant: Subscriber;
  nickname: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  votes: number;
  isCandidate: boolean;
}
