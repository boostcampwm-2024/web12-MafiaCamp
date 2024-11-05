import { FindGameUserUsecase } from './usecase/find.game-user.usecase';
import { RegisterGameUserUsecase } from './usecase/register.game-user.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { GameHistoryEntity } from '../game/entity/game.history.entity';
import { FindUserUsecase } from '../user/usecase/find.user.usecase';
import { GameUserRepository } from './repository/game-user.repository';
import { GameUserEntity } from './enitity/game.user.entity';
import { FindUserRequest } from '../user/dto/find-user.request';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class GameUserService implements FindGameUserUsecase, RegisterGameUserUsecase {

  constructor(
    @Inject('FIND_USER_USECASE')
    private readonly findUserUseCase: FindUserUsecase,
    @Inject('GAME_USER_REPOSITORY')
    private readonly gameUserRepository: GameUserRepository<GameUserEntity, number, number>) {
  }

  @Transactional()
  async register(userId: number, gameHistory: GameHistoryEntity): Promise<void> {
    const userEntity = await this.findUserUseCase.findById(new FindUserRequest(userId));
    const gameUserEntity = GameUserEntity.create(gameHistory, userEntity);
    await this.gameUserRepository.save(gameUserEntity);
  }

  async findByGameHistoryId(gameHistoryId: number): Promise<GameUserEntity> {
    return await this.gameUserRepository.findByGameId(gameHistoryId);
  }

  async findByUserId(userId: number): Promise<GameUserEntity> {
    return await this.gameUserRepository.findByUserId(userId);
  }

}