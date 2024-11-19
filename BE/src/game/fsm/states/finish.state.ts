import { Inject, Injectable } from '@nestjs/common';
import { GameState } from './state';
import { GameContext } from '../game-context';
import { FINISH_GAME_USECASE, FinishGameUsecase } from 'src/game/usecase/finish-game/finish-game.usecase';
import { GameRoomStatus } from 'src/game-room/entity/game-room.status';

@Injectable()
export class FinishState extends GameState {
  constructor(
    @Inject(FINISH_GAME_USECASE)
    private readonly finishGameUsecase: FinishGameUsecase,
  ) {
    super();
  }

  async handle(context: GameContext) {
    const room = context.room;
    room.status = GameRoomStatus.DONE;
    this.finishGameUsecase.finish(room);
  }
}
