import { GameRoom } from '../../../game-room/entity/game-room.model';
import { EventClient } from '../../../event/event-client.model';

export const DETECT_MANAGER = Symbol('DETECT_MANAGER');

export interface DetectManager {
  detect(gameRoom: GameRoom, client: EventClient): Promise<boolean>;
}