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
import { CitizenWinState } from './citizen-win.state';
import { FINISH_GAME_USECASE, FinishGameUsecase } from 'src/game/usecase/finish-game/finish-game.usecase';

@Injectable()
export class FinalVoteState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => MafiaState))
    private readonly mafiaState: MafiaState,
    @Inject(forwardRef(() => CitizenWinState))
    private readonly citizenWinState: CitizenWinState,
    @Inject(VOTE_MAFIA_USECASE)
    private readonly voteMafiaUsecase: VoteMafiaUsecase,
    @Inject(FINISH_GAME_USECASE)
    private readonly finishGameUsecase: FinishGameUsecase,
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
    if (await this.finishGameUsecase.checkFinishCondition(room)) {
      // 마피아 승리가 되는 경우도 있음.
      return next(this.citizenWinState);
    }
    next(this.mafiaState);
  }
}
