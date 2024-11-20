import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';
import { DiscussionState } from './discussion.state';
import {
  POLICE_MANAGER,
  PoliceManager,
} from '../../usecase/role-playing/police-manager';
import {
  KILL_DECISION_MANAGER,
  KillDecisionManager,
} from '../../usecase/role-playing/killDecision-manager';

@Injectable()
export class PoliceState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => DiscussionState))
    private readonly discussionState: DiscussionState,
    @Inject(POLICE_MANAGER)
    private readonly policeManager: PoliceManager,
    @Inject(KILL_DECISION_MANAGER)
    private readonly killDecisionManager: KillDecisionManager,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    //경찰의 생존 유무에 따른 카운터 함수 실행
    if (await this.policeManager.isPoliceAlive(room)) {
      await this.policeManager.initPolice(room);
      await this.countdownTimeoutUsecase.countdownStart(
        new StartCountdownRequest(room, 'POLICE'),
      );
      await this.policeManager.finishPolice(room);
    }

    // todo: 게임 종료 시 마피아 선택 로그 삭제하기
    await this.killDecisionManager.determineKillTarget(room);

    // todo: 경찰 상태가 끝나면 이제 낮이 되는데 바로 토론 상태로 가는 것이 아니라 게임 승리 조건을 확인해서 처리해야할 것 같습니다.
    next(this.discussionState);
  }
}
