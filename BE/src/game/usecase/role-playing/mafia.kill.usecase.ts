import { GameRoom } from '../../../game-room/entity/game-room.model';

export const MAFIA_KILL_USECASE = Symbol('MAFIA_KILL_USECASE');

export interface MafiaKillUsecase {
  mafiaSelectTarget(
    gameRoom: GameRoom,
    from: string,
    target: string,
  ): Promise<void>;

  sendCurrentTarget(target: string, gameRoom: GameRoom): Promise<void>;

  initMafia(gameRoom: GameRoom): Promise<void>;

  decisionMafiaTarget(gameRoom: GameRoom): Promise<void>;
}
