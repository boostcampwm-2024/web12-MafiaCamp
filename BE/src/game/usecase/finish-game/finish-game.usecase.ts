import { GameRoom } from "src/game-room/entity/game-room.model";

export const FINISH_GAME_USECASE = Symbol('FINISH_GAME_USECASE');
export interface FinishGameUsecase {
  finish(gameRoom: GameRoom): void;
}
