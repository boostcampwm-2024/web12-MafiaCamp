import { Publisher } from 'openvidu-browser';

export interface GamePublisher {
  participant: Publisher;
  nickname: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  votes: number;
  isAlive: boolean;
}
