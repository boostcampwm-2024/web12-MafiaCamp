import { Inject, Injectable } from '@nestjs/common';
import { GameState } from './state';
import { GameContext } from '../game-context';
import { FINISH_GAME_USECASE, FinishGameUsecase } from 'src/game/usecase/finish-game/finish-game.usecase';
import { VIDEO_SERVER_USECASE, VideoServerUsecase } from 'src/video-server/usecase/video-server.usecase';
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';
import { GameContextManager } from '../game-context.manager';

@Injectable()
export class MafiaWinState extends GameState {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
    @Inject(FINISH_GAME_USECASE)
    private readonly finishGameUsecase: FinishGameUsecase,
    private readonly gameContextManager: GameContextManager,
  ) {
    super();
  }

  async handle(context: GameContext) {
    const room = context.room;
    room.result = GAME_HISTORY_RESULT.MAFIA;
    await this.videoServerUseCase.closeSession(room.roomId);
    await this.finishGameUsecase.finishGame(room);
    await this.gameContextManager.removeContext(room.roomId);
  }
}
