import { GameHistoryEntity } from '../../game/entity/game-history.entity';

export const REGISTER_GAME_USER_USECASE = Symbol('REGISTER_GAME_USER_USECASE');

export interface RegisterGameUserUsecase {
  register(userId: number, gameHistory: GameHistoryEntity) : Promise<void>;
}