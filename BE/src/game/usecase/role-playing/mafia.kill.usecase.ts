import { GameRoom } from '../../../game-room/entity/game-room.model';

export const MAFIA_KILL_USECASE = Symbol('MAFIA_KILL_USECASE');

export interface MafiaKillUsecase {
  mafiaSelectTarget(gameRoom: GameRoom, target: string): Promise<void>;

  sendCurrentTarget(target: string, gameRoom: GameRoom): Promise<void>;

  initMafia(gameRoom: GameRoom): Promise<void>;

  finishMafia(gameRoom: GameRoom): Promise<void>;
}
