import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import { CountdownTimeoutService } from 'src/game/usecase/countdown/countdown.timeout.service';
import { COUNTDOWN_TIMEOUT_USECASE } from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { MafiaState } from './mafia.state';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';

@Injectable()
export class ArgumentState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutService: CountdownTimeoutService,
    @Inject(forwardRef(() => MafiaState))
    private readonly mafiaState: MafiaState,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    await this.countdownTimeoutService.countdownStart(
      new StartCountdownRequest(room, 'ARGUMENT'),
    );
    next(this.mafiaState);
  }
}
