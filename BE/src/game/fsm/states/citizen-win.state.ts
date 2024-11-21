import { Inject, Injectable } from '@nestjs/common';
import { GameState } from './state';
import { GameContext } from '../game-context';
import { FINISH_GAME_USECASE, FinishGameUsecase } from 'src/game/usecase/finish-game/finish-game.usecase';
import { GameRoomStatus } from 'src/game-room/entity/game-room.status';
import { VIDEO_SERVER_USECASE, VideoServerUsecase } from 'src/video-server/usecase/video-server.usecase';
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';

@Injectable()
export class CitizenWinState extends GameState {
  constructor(
    @Inject(VIDEO_SERVER_USECASE)
    private readonly videoServerUseCase: VideoServerUsecase,
    @Inject(FINISH_GAME_USECASE)
    private readonly finishGameUsecase: FinishGameUsecase,
  ) {
    super();
  }

  async handle(context: GameContext) {
    const room = context.room;
    room.result = GAME_HISTORY_RESULT.CITIZEN;
    room.status = GameRoomStatus.DONE;
    await this.videoServerUseCase.closeSession(room.roomId);
    this.finishGameUsecase.finishGame(room);
  }
}
