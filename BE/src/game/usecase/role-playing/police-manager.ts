import { GameRoom } from '../../../game-room/entity/game-room.model';

export const POLICE_MANAGER = Symbol('POLICE_MANAGER');

export interface PoliceManager {
  initPolice(gameRoom: GameRoom): Promise<void>;

  executePolice(gameRoom: GameRoom, police: string, criminal: string): Promise<void>;

  finishPolice(gameRoom: GameRoom): Promise<void>;
}