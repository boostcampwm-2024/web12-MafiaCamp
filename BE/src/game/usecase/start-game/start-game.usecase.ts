import { GameRoom } from "src/game-room/entity/game-room.model";

export const START_GAME_USECASE = Symbol('START_GAME_USECASE');
export interface StartGameUsecase {
  startGame(gameRoom: GameRoom): void;
}
