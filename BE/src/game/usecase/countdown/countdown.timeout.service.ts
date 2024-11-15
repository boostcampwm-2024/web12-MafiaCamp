import { CountdownTimeoutUsecase } from './countdown.timeout.usecase';
import { StartCountdownRequest } from '../../dto/start.countdown.request';
import { StopCountdownRequest } from '../../dto/stop.countdown.request';
import { Inject, Injectable } from '@nestjs/common';
import { COUNTDOWN_TIMER, CountdownTimer } from './countdown.timer';

@Injectable()
export class CountdownTimeoutService implements CountdownTimeoutUsecase {

  constructor(
    @Inject(COUNTDOWN_TIMER)
    private readonly countdownTimer: CountdownTimer,
  ) {
  }

  async countdownStart(startCountdownRequest: StartCountdownRequest): Promise<void> {
    await this.countdownTimer.start(startCountdownRequest.room, startCountdownRequest.situation);
  }

  async countdownStop(stopCountdownRequest: StopCountdownRequest): Promise<void> {
    await this.countdownTimer.stop(stopCountdownRequest.room);
  }

}