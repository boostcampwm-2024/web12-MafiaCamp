import { Inject, Injectable } from '@nestjs/common';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import { FinishGameUsecase } from './finish-game.usecase';
import { FINISH_GAME_MANAGER, FinishGameManager } from './finish-game.manager';

@Injectable()
export class FinishGameService implements FinishGameUsecase {
  constructor(
    @Inject(FINISH_GAME_MANAGER)
    private readonly gameManager: FinishGameManager,
  ) {
  }

  async finishGame(gameRoom: GameRoom): Promise<void> {
    await this.gameManager.finishGame(gameRoom);
  }

  async checkFinishCondition(gameRoom: GameRoom): Promise<boolean> {
    return await this.gameManager.checkFinishCondition(gameRoom);
  }
}