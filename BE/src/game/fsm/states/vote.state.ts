import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import { CountdownTimeoutService } from 'src/game/usecase/countdown/countdown.timeout.service';
import { COUNTDOWN_TIMEOUT_USECASE } from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { ArgumentState } from './argument.state';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';

@Injectable()
export class VoteState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutService: CountdownTimeoutService,
    @Inject(forwardRef(() => ArgumentState))
    private readonly argumentState: ArgumentState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    await this.countdownTimeoutService.countdownStart(
      new StartCountdownRequest(room, 'VOTE'),
    );
    // VoteState에서는 현재가 첫 번째 투표인지 두 번째 투표인지에 따라 다음 상태가 달라질 것 같습니다. 우선은 다음 상태를 최후 변론 상태로 해두었습니다.
    next(this.argumentState);
  }
}
