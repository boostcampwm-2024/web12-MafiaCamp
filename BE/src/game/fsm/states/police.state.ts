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
import { GameClient } from 'src/game-room/entity/game-client.model';

@Injectable()
export class PoliceState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => DiscussionState))
    private readonly discussionState: DiscussionState,
    @Inject(POLICE_INVESTIGATE_USECASE)
    private readonly policeInvestigateUsecase: PoliceInvestigateUsecase,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const cleanups = [];
    const room = context.room;

    await Promise.race([this.timeout(room, cleanups), this.investigate(room, cleanups)]);
    this.cleanup(cleanups);

    // todo: 경찰 상태가 끝나면 이제 낮이 되는데 바로 토론 상태로 가는 것이 아니라 게임 승리 조건을 확인해서 처리해야할 것 같습니다.
    next(this.discussionState);
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
    const polices = room.clients.filter(c => c.job === MAFIA_ROLE.POLICE);

    return new Promise((resolve) => {
      const listener = async (data: PoliceInvestigationRequest) => {
        await this.policeInvestigateUsecase.executePolice(room, data.police, data.criminal);
        resolve();
      };
  
      cleanups.push(() => {
        polices.forEach(police => police.removeListener('police-investigate', listener));
      });
      polices.forEach(police => police.once('police-investigate', listener));
    });
  }

  private cleanup(cleanups) {
    cleanups.forEach(fn => fn());
  }
}
