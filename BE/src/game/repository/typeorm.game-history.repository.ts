import { GameHistoryEntity } from '../entity/game-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistoryRepository } from './game-history.repository';
import { NotFoundGameHistoryException } from '../../common/error/not.found.game.history.exception';

export class TypeormGameHistoryRepository
  implements GameHistoryRepository<GameHistoryEntity, number>
{
  constructor(
    @InjectRepository(GameHistoryEntity)
    private readonly _repository: Repository<GameHistoryEntity>,
  ) {}

  async findById(gameHistoryId: number): Promise<GameHistoryEntity> {
    const gameHistoryEntity = await this._repository.findOneBy({
      gameId: gameHistoryId,
    });

    if (gameHistoryEntity) {
      return gameHistoryEntity;
    }
    throw new NotFoundGameHistoryException();
  }

  async save(gameHistoryEntity: GameHistoryEntity): Promise<void> {
    await this._repository.insert(gameHistoryEntity);
  }
}
