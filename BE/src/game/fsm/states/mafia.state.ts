import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StartCountdownRequest } from 'src/game/dto/start.countdown.request';
import {
  COUNTDOWN_TIMEOUT_USECASE,
  CountdownTimeoutUsecase,
} from 'src/game/usecase/countdown/countdown.timeout.usecase';
import { GameState, TransitionHandler } from './state';
import { DoctorState } from './doctor.state';
import { GameContext } from '../game-context';
import {
  MAFIA_MANAGER,
  MafiaManager,
} from '../../usecase/role-playing/mafia-manager';

@Injectable()
export class MafiaState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => DoctorState))
    private readonly doctorState: DoctorState,
    @Inject(MAFIA_MANAGER)
    private readonly mafiaManager: MafiaManager,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
    await this.mafiaManager.initMafia(room);
    await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'MAFIA'),
    );
    await this.mafiaManager.decisionMafiaTarget(room);
    next(this.doctorState);
  }
}
