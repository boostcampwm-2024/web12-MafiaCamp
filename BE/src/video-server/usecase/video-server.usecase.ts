import { OpenViduRole } from 'openvidu-node-client';
import { SessionParticipant } from '../types/session-participant.type';

export const VIDEO_SERVER_USECASE = Symbol.for('VIDEO_SERVER_USECASE');

export interface VideoServerUsecase {
  createSession(roomId: string): Promise<string>;
  closeSession(roomId: string): Promise<void>;
  generateToken(
    roomId: string,
    userId: string,
    role: OpenViduRole,
    nickname?: string,
  ): Promise<string>;
  getActiveParticipants(roomId: string): Promise<SessionParticipant[]>;
}
