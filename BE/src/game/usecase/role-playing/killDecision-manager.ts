import { GameRoom } from '../../../game-room/entity/game-room.model';

export const KILL_DECISION_MANAGER = Symbol('KILL_DECISION_MANAGER');

export interface KillDecisionManager {
  determineKillTarget(gameRoom: GameRoom): Promise<void>;
}
