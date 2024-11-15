import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { FinalVoteState } from './final-vote.state';

@Injectable()
export class ArgumentState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => FinalVoteState))
    private readonly finalVoteState: FinalVoteState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'ARGUMENT'),
    );
    next(this.finalVoteState);
  }
}
