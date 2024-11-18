import { Role } from '@/constants/role';
import { Subscriber } from 'openvidu-browser';

export interface GameSubscriber {
  participant: Subscriber;
  nickname: string;
  role: Role | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  votes: number;
  isCandidate: boolean;
}
