import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { ArgumentState } from './argument.state';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { VOTE_MAFIA_USECASE, VoteMafiaUsecase } from '../../usecase/vote-manager/vote.mafia.usecase';
import { VOTE_STATE } from '../../vote-state';
import { MafiaState } from './mafia.state';

@Injectable()
export class PrimaryVoteState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => ArgumentState))
    private readonly argumentState: ArgumentState,
    @Inject(forwardRef(() => MafiaState))
    private readonly mafiaState: MafiaState,
    @Inject(VOTE_MAFIA_USECASE)
    private readonly voteMafiaUsecase: VoteMafiaUsecase,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    if (context.isGameTerminated()) return;
    await this.voteMafiaUsecase.registerBallotBox(room);
    await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'VOTE'),
    );

    const voteState: VOTE_STATE = await this.voteMafiaUsecase.primaryVoteResult(room);
    if (voteState === VOTE_STATE.PRIMARY) {
      next(this.argumentState);
    } else if (voteState === VOTE_STATE.INVALIDITY) {
      next(this.mafiaState);
    }
  }
}
