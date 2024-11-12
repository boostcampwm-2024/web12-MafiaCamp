import { Publisher } from 'openvidu-browser';

export interface GamePublisher {
  participant: Publisher;
  audioEnabled: boolean;
  videoEnabled: boolean;
}
