import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { PoliceState } from './police.state';
import { GameContext } from '../game-context';
import {
  DOCTOR_MANAGER,
  DoctorManager,
} from '../../usecase/role-playing/doctor-manager';

@Injectable()
export class DoctorState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => PoliceState))
    private readonly policeState: PoliceState,
    @Inject(DOCTOR_MANAGER)
    private readonly doctorManager: DoctorManager,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    //의사의 생존 유무에 따른 카운터 함수 실행
    if (await this.doctorManager.isDoctorAlive(room)) {
      await this.countdownTimeoutUsecase.countdownStart(
        new StartCountdownRequest(room, 'DOCTOR'),
      );
    }

    next(this.policeState);
  }
}
