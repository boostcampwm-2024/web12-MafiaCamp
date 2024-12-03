import { GameRoom } from '../../game-room/entity/game-room.model';
import { EventClient } from '../../event/event-client.model';

export class DetectEarlyQuitRequest {
  gameRoom: GameRoom;
  eventClient: EventClient;

  constructor(gameRoom: GameRoom, eventClient: EventClient) {
    this.gameRoom = gameRoom;
    this.eventClient = eventClient;
  }
}