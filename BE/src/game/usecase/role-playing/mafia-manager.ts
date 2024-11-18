import { GameRoom } from '../../../game-room/entity/game-room.model';

export const MAFIA_MANAGER = Symbol('MAFIA_MANAGER');

export interface MafiaManager {
  selectMafiaTarget(gameRoom: GameRoom, target: string): Promise<void>;

  sendCurrentMafiaTarget(target: string, gameRoom: GameRoom): Promise<void>;

  initMafia(gameRoom: GameRoom): Promise<void>;

  decisionMafiaTarget(gameRoom: GameRoom): Promise<void>;
}
