import { Role } from '@/constants/role';
import { Publisher } from 'openvidu-browser';

export interface GamePublisher {
  isRoomManager: boolean;
  participant: Publisher | null;
  nickname: string;
  role: Role | null;
  audioEnabled: boolean;
  videoEnabled: boolean;
  votes: number;
  isCandidate: boolean;
  isAlive: boolean;
}
