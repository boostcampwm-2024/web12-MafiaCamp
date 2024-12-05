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
import { GameRoom } from 'src/game-room/entity/game-room.model';
import { StopCountdownRequest } from 'src/game/dto/stop.countdown.request';
import { DOCTOR_CURE_USECASE, DoctorCureUsecase } from 'src/game/usecase/role-playing/doctor.cure.usecase';
import { SelectDoctorTargetRequest } from 'src/game/dto/select.doctor.target.request';
import { MAFIA_ROLE } from 'src/game/mafia-role';
import { NotFoundDoctorException } from '../../../common/error/not.found.doctor.exception';

@Injectable()
export class DoctorState extends GameState {
  constructor(
    @Inject(COUNTDOWN_TIMEOUT_USECASE)
    private readonly countdownTimeoutUsecase: CountdownTimeoutUsecase,
    @Inject(forwardRef(() => PoliceState))
    private readonly policeState: PoliceState,
    @Inject(DOCTOR_MANAGER)
    private readonly doctorManager: DoctorManager,
    @Inject(DOCTOR_CURE_USECASE)
    private readonly doctorCureUsecase: DoctorCureUsecase,
  ) {
    super();
  }

  async handle(context: GameContext, next: TransitionHandler) {
    if (context.isGameTerminated()) return;
    const cleanups = [];
    const room = context.room;

    if (!await this.doctorManager.isDoctorAlive(room)) {
      return next(this.policeState);
    }

    await Promise.race([this.timeout(room, cleanups), this.selectDoctorTarget(room, cleanups)]);
    this.cleanup(cleanups);
    next(this.policeState);
  }

  private async timeout(room: GameRoom, cleanups) {
    cleanups.push(() => {
      this.countdownTimeoutUsecase.countdownStop(
        new StopCountdownRequest(room),
      );
    });
    return await this.countdownTimeoutUsecase.countdownStart(
      new StartCountdownRequest(room, 'DOCTOR'),
    );
  }


  private selectDoctorTarget(room: GameRoom, cleanups): Promise<void> {
    const doctor = room.clients.find(c => c.job === MAFIA_ROLE.DOCTOR);

    return new Promise((resolve) => {
      const listener = async (data: SelectDoctorTargetRequest) => {
        await this.doctorCureUsecase.selectDoctorTarget(room, data.from, data.target);
        resolve();
      };

      cleanups.push(() => {
        doctor.removeListener('select-doctor-target', listener);
      });
      try {
        doctor.once('select-doctor-target', listener);
      } catch (e){
        throw new NotFoundDoctorException();
      }
    });
  }

  private cleanup(cleanups) {
    cleanups.forEach(fn => fn());
  }
}
