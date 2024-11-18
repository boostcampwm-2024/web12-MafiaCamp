import { Role } from '@/constants/role';
import { Publisher } from 'openvidu-browser';

export interface GamePublisher {
  participant: Publisher;
  nickname: string;
  role: Role | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  votes: number;
  isCandidate: boolean;
}
