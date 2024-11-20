import { GameRoom } from '../../../game-room/entity/game-room.model';

export const CHECK_FINISH_MANAGER = Symbol('CHECK_FINISH_MANAGER');

export interface CheckFinishManager {
  initPolice(gameRoom: GameRoom): Promise<void>;
}