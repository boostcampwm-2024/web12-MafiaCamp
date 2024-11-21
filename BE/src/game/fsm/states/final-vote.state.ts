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
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';
import { MafiaWinState } from './mafia-win.state';

@Injectable()
export class FinalVoteState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => MafiaState))
    private readonly mafiaState: MafiaState,
    @Inject(forwardRef(() => CitizenWinState))
    private readonly citizenWinState: CitizenWinState,
    @Inject(forwardRef(() => MafiaWinState))
    private readonly mafiaWinState: MafiaWinState,
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
    const result = await this.finishGameUsecase.checkFinishCondition(room);
    if (result === GAME_HISTORY_RESULT.MAFIA) {
      return next(this.mafiaWinState);
    }
    if (result === GAME_HISTORY_RESULT.CITIZEN) {
      return next(this.citizenWinState);
    }
    next(this.mafiaState);
  }
}
