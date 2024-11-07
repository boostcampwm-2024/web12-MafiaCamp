export const COUNTDOWN_TIMER = Symbol('COUNTDOWN_TIMER');

export interface CountdownTimer {
  start(roomId: string, situation: string): void;

  stop(roomId: string): void;
}