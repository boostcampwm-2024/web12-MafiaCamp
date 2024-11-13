import { StartCountdownRequest } from '../../dto/start.countdown.request';
import { StopCountdownRequest } from '../../dto/stop.countdown.request';

export const COUNTDOWN_TIMEOUT_USECASE = Symbol('COUNTDOWN_TIMEOUT_USECASE');

export interface CountdownTimeoutUsecase {
  countdownStart(startCountdownRequest: StartCountdownRequest) : void;

  countdownStop(stopCountdownRequest: StopCountdownRequest): void;
}