import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameUserRepository } from './game-user.repository';
import { GameUserEntity } from '../enitity/game.user.entity';
import { NotFoundGameUserError } from '../../common/error/not.found.game-user.error';
import { errorMessage } from '../../common/error/error.message';
import { errorCode } from '../../common/error/error.code';

export class TypeormGameUserRepository implements GameUserRepository<GameUserEntity, number, number> {

  constructor(@InjectRepository(GameUserEntity)
              private readonly _repository: Repository<GameUserEntity>) {
  }


  async save(gameUserEntity: GameUserEntity): Promise<GameUserEntity> {
    return await this._repository.save(gameUserEntity);
  }

  async findByGameId(gameId: number): Promise<GameUserEntity> {
    const gameUserEntity = await this._repository.findOneBy({
      gameId: gameId,
    });
    if (gameUserEntity) {
      return gameUserEntity;
    }
    throw new NotFoundGameUserError(errorMessage.NOT_FOUND_GAME_USER_ERROR, errorCode.NOT_FOUND_GAME_USER_ERROR);
  }

  async findByUserId(userId: number): Promise<GameUserEntity> {
    const gameUserEntity = await this._repository.findOneBy({
      userId: userId,
    });
    if (gameUserEntity) {
      return gameUserEntity;
    }
    throw new NotFoundGameUserError(errorMessage.NOT_FOUND_GAME_USER_ERROR, errorCode.NOT_FOUND_GAME_USER_ERROR);
  }
}