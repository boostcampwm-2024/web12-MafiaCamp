import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import { CountdownTimeoutService } from 'src/game/usecase/countdown/countdown.timeout.service';
import { COUNTDOWN_TIMEOUT_USECASE } from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { VoteState } from './vote.state';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';

@Injectable()
export class DiscussionState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutService: CountdownTimeoutService,
    @Inject(forwardRef(() => VoteState))
    private readonly voteState: VoteState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    await this.countdownTimeoutService.countdownStart(
      new StartCountdownRequest(room, 'DISCUSSION'),
    );
    next(this.voteState);
  }
}
