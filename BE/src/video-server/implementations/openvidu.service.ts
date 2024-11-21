import { Injectable } from '@nestjs/common';
import { OpenVidu, OpenViduRole, Session } from 'openvidu-node-client';
import { ConfigService } from '@nestjs/config';
import { VideoServerUsecase } from '../usecase/video-server.usecase';
import { SessionParticipant } from '../types/session-participant.type';
import { OpenViduRoleType } from '../types/openvidu.type';
import {
  OpenviduSessionCloseFailedException,
  OpenviduSessionCreateFailedException,
  OpenviduSessionNotFoundException,
} from '../../common/error/openvidu.session.exception';
import { OpenViduTokenGenerationFailedException } from '../../common/error/openvidu.token.exception';
import {
  OpenViduParticipantDisconnectFailedException,
  OpenViduParticipantListFetchFailedException,
} from '../../common/error/openvidu.participant.exception';

@Injectable()
export class OpenviduService implements VideoServerUsecase {
  private openvidu: OpenVidu;
  private sessions: Map<string, Session>;

  constructor(private configService: ConfigService) {
    const OPENVIDU_URL = this.configService.get<string>('OPENVIDU_URL');
    const OPENVIDU_SECRET = this.configService.get<string>('OPENVIDU_SECRET');
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    this.sessions = new Map();
  }

  async createSession(roomId: string): Promise<string> {
    try {
      const session = await this.openvidu.createSession({
        customSessionId: roomId,
      });
      this.sessions.set(roomId, session);
      return session.sessionId;
    } catch (error) {
      console.error(`Failed to create session: ${error.message}`);
      throw new OpenviduSessionCreateFailedException();
    }
  }

  async closeSession(roomId: string): Promise<void> {
    try {
      const session = this.sessions.get(roomId);
      if (!session) return;

      await session.fetch();
      const activeConnections = session.activeConnections;

      for (const connection of activeConnections) {
        try {
          await session.forceDisconnect(connection);
        } catch (error) {
          console.error(
            `Failed to disconnect connection ${connection.connectionId}: ${error.message}`,
          );
        }
      }
      await session.close();
      this.sessions.delete(roomId);
      console.log(`Session ${roomId} successfully closed and cleaned up`);
    } catch (error) {
      console.error(`Failed to close session: ${error.message}`);
      throw new OpenviduSessionCloseFailedException();
    }
  }

  async generateToken(
    roomId: string,
    userId: string,
    role: OpenViduRoleType,
    nickname?: string,
  ): Promise<string> {
    try {
      const session = this.sessions.get(roomId);
      if (!session) throw new OpenviduSessionNotFoundException();

      const openViduRole = OpenViduRole[role];
      const connection = await session.createConnection({
        role: openViduRole,
        data: JSON.stringify({ userId, nickname }),
      });

      return connection.token;
    } catch (error) {
      console.error(`Failed to generate token: ${error.message}`);
      throw new OpenViduTokenGenerationFailedException();
    }
  }

  async handleLeaveParticipant(roomId: string, userId: string): Promise<void> {
    try {
      const session = this.sessions.get(roomId);
      if (!session) throw new OpenviduSessionNotFoundException();

      await session.fetch();
      const connection = session.activeConnections.find(
        (connection) =>
          JSON.parse(connection.connectionProperties.data).userId === userId,
      );

      if (connection) {
        await session.forceDisconnect(connection);
      }
    } catch (error) {
      console.error(`Failed to handle participant leave: ${error.message}`);
      throw new OpenViduParticipantDisconnectFailedException();
    }
  }

  async getActiveParticipants(roomId: string): Promise<SessionParticipant[]> {
    try {
      const session = this.sessions.get(roomId);
      if (!session) throw new OpenviduSessionNotFoundException();

      await session.fetch();
      return session.activeConnections.map((connection) => ({
        connectionId: connection.connectionId,
        userId: JSON.parse(connection.connectionProperties.data).userId,
        nickname: JSON.parse(connection.connectionProperties.data).nickname,
        role: connection.role as OpenViduRole,
        isActive: true,
      }));
    } catch (error) {
      console.error(`Failed to get participants: ${error.message}`);
      throw new OpenViduParticipantListFetchFailedException();
    }
  }
}
