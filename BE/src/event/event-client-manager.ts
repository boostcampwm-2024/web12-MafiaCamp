import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EventClient } from './event-client.model';
import { NotFoundUserException } from '../common/error/not.found.user.exception';
import { EventManager } from './event-manager';
import { Event } from './event.const';

@Injectable()
export class EventClientManager {
  private connectedClients: Map<Socket, EventClient> = new Map();
  constructor(private readonly eventManager: EventManager) {}

  addClient(socket: Socket, client: EventClient): void {
    this.connectedClients.set(socket, client);
  }

  removeClient(socket: Socket): void {
    this.connectedClients.delete(socket);
  }

  updateNickName(userId: number, updateNickName: string) {
    for (const [, eventClient] of this.connectedClients) {
      if (eventClient.userId === userId) {
        eventClient.nickname = updateNickName;
        this.eventManager.publish(Event.USER_DATA_CHANGED, {
          event: 'upsert-online-user',
          data: {
            userId: String(userId),
            nickname: eventClient.nickname,
            isInLobby: true,
          },
        });

        return;
      }
    }
    throw new NotFoundUserException();
  }

  getClientBySocket(socket: Socket): EventClient | undefined {
    return this.connectedClients.get(socket);
  }

  getClients(): Map<Socket, EventClient> {
    return this.connectedClients;
  }
}
