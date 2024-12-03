import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { PrimaryVoteState } from './primary-vote.state';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';

@Injectable()
export class DiscussionState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => PrimaryVoteState))
    private readonly primaryVoteState: PrimaryVoteState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    if (context.isGameTerminated()) return;
    const room = context.room;
    await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'DISCUSSION'),
    );
    next(this.primaryVoteState);
  }
}
