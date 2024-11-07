import { GameUserEntity } from '../enitity/game-user.entity';

export const FIND_GAME_USER_USECASE = Symbol('FIND_GAME_USER_USECASE');

export interface FindGameUserUsecase {
  findByUserId(userId: number): Promise<GameUserEntity>;

  findByGameHistoryId(gameHistoryId: number): Promise<GameUserEntity>;
}