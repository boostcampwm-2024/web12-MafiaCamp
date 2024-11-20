import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';
import { GameRoom } from '../../../game-room/entity/game-room.model';

export const FINISH_GAME_MANAGER = Symbol('FINISH_GAME_MANAGER');

export interface FinishGameManager {
  finishGame(gameRoom: GameRoom): Promise<void>;
  checkFinishCondition(gameRoom: GameRoom): Promise<GAME_HISTORY_RESULT>;
}