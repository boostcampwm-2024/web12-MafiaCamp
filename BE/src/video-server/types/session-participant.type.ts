import { OpenViduRole } from 'openvidu-node-client';

export interface SessionParticipant {
  connectionId: string;
  userId: string;
  role: OpenViduRole;
  nickname?: string;
  isActive: boolean;
}
