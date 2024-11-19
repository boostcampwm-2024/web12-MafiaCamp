import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { VOTE_MAFIA_USECASE, VoteMafiaUsecase } from '../../usecase/vote-manager/vote.mafia.usecase';
import { MafiaState } from './mafia.state';

@Injectable()
export class FinalVoteState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => MafiaState))
    private readonly mafiaState: MafiaState,
    @Inject(VOTE_MAFIA_USECASE)
    private readonly voteMafiaUsecase: VoteMafiaUsecase,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    await this.voteMafiaUsecase.registerBallotBox(room);
    await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'VOTE'),
    );

    await this.voteMafiaUsecase.finalVoteResult(room);
    next(this.mafiaState);
  }
}
