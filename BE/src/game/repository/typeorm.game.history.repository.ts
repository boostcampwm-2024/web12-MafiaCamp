import { GameHistoryEntity } from '../entity/game.history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistoryRepository } from './game.history.repository';
import { NotFoundGameHistoryError } from '../../common/error/not.found.game.history.error';
import { errorMessage } from '../../common/error/error.message';
import { errorCode } from '../../common/error/error.code';

export class TypeormGameHistoryRepository implements GameHistoryRepository<GameHistoryEntity, number> {

  constructor(@InjectRepository(GameHistoryEntity)
              private readonly _repository: Repository<GameHistoryEntity>) {
  }

  async findById(gameHistoryId: number): Promise<GameHistoryEntity> {
    const gameHistoryEntity = await this._repository.findOneBy({
      gameId: gameHistoryId,
    });

    if (gameHistoryEntity) {
      return gameHistoryEntity;
    }
    throw new NotFoundGameHistoryError(errorMessage.NOT_FOUND_GAME_HISTORY_ERROR, errorCode.NOT_FOUND_GAME_HISTORY_ERROR);
  }

  async save(gameHistoryEntity: GameHistoryEntity): Promise<GameHistoryEntity> {
    return await this._repository.save(gameHistoryEntity);
  }
}