import { GameRoom } from "src/game-room/entity/game-room.model";
import { GAME_HISTORY_RESULT } from "src/game/entity/game-history.result";

export const FINISH_GAME_USECASE = Symbol('FINISH_GAME_USECASE');

export interface FinishGameUsecase {
  finishGame(gameRoom: GameRoom): Promise<void>;
  checkFinishCondition(gameRoom: GameRoom): Promise<GAME_HISTORY_RESULT>;
}
