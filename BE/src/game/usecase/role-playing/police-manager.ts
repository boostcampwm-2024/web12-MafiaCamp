import { GameRoom } from '../../../game-room/entity/game-room.model';

export const POLICE_MANAGER = Symbol('POLICE_MANAGER');

export interface PoliceManager {
  isPoliceAlive(gameRoom: GameRoom): Promise<boolean>;

  executePolice(
    gameRoom: GameRoom,
    police: string,
    criminal: string,
  ): Promise<void>;
}
