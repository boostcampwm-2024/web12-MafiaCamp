import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { DiscussionState } from './discussion.state';
import { StopCountdownRequest } from 'src/game/dto/stop.countdown.request';
import { POLICE_INVESTIGATE_USECASE, PoliceInvestigateUsecase } from 'src/game/usecase/role-playing/police.investigate.usecase';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import { MAFIA_ROLE } from 'src/game/mafia-role';
import { PoliceInvestigationRequest } from 'src/game/dto/police.investigation.request';
import {
  KILL_DECISION_MANAGER,
  KillDecisionManager,
} from '../../usecase/role-playing/killDecision-manager';
import { FINISH_GAME_USECASE, FinishGameUsecase } from 'src/game/usecase/finish-game/finish-game.usecase';
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';
import { MafiaWinState } from './mafia-win.state';
import { NotFoundPoliceException } from '../../../common/error/not.found.police.exception';

@Injectable()
export class PoliceState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => DiscussionState))
    private readonly discussionState: DiscussionState,
    @Inject(forwardRef(() => MafiaWinState))
    private readonly mafiaWinState: MafiaWinState,
    @Inject(POLICE_INVESTIGATE_USECASE)
    private readonly policeInvestigateUsecase: PoliceInvestigateUsecase,
    @Inject(KILL_DECISION_MANAGER)
    private readonly killDecisionManager: KillDecisionManager,
    @Inject(FINISH_GAME_USECASE)
    private readonly finishGameUsecase: FinishGameUsecase,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    if (context.isGameTerminated()) return;
    const cleanups = [];
    const room = context.room;

    const done = async () => {
      await this.killDecisionManager.determineKillTarget(room);
      const result = await this.finishGameUsecase.checkFinishCondition(room);
      if (result === GAME_HISTORY_RESULT.MAFIA) {
        return next(this.mafiaWinState);
      }
      return next(this.discussionState);
    };

    if (!await this.policeInvestigateUsecase.isPoliceAlive(room)) {
      return done();
    }

    await Promise.race([this.timeout(room, cleanups), this.investigate(room, cleanups)]);
    this.cleanup(cleanups);
    await done();
  }

  private async timeout(room: GameRoom, cleanups) {
    cleanups.push(() => {
      this.countdownTimeoutUsecase.countdownStop(
        new StopCountdownRequest(room),
      );
    });
    return await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'POLICE'),
    );
  }

  private investigate(room: GameRoom, cleanups): Promise<void> {
    const police = room.clients.find(c => c.job === MAFIA_ROLE.POLICE);

    return new Promise((resolve) => {
      const listener = async (data: PoliceInvestigationRequest) => {
        await this.policeInvestigateUsecase.executePolice(room, data.police, data.criminal);
        resolve();
      };
  
      cleanups.push(() => {
        police.removeListener('police-investigate', listener);
      });
      try {
        police.once('police-investigate', listener);
      } catch (e){
        throw new NotFoundPoliceException();
      }
    });
  }

  private cleanup(cleanups) {
    cleanups.forEach(fn => fn());
  }
}
