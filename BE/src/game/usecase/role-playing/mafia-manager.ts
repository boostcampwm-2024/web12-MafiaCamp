import { GameRoom } from '../../../game-room/entity/game-room.model';

export const MAFIA_MANAGER = Symbol('MAFIA_MANAGER');

export interface MafiaManager {
  selectMafiaTarget(
    gameRoom: GameRoom,
    from: string,
    killTarget: string,
  ): Promise<void>;

  initMafia(gameRoom: GameRoom): Promise<void>;

  decisionMafiaTarget(gameRoom: GameRoom): Promise<void>;
}
