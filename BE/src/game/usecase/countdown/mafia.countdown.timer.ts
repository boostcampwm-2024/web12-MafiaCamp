import { CountdownTimer } from './countdown.timer';
import { Injectable } from '@nestjs/common';
import { TIMEOUT_SITUATION } from '../../timeout.situation';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { DuplicateTimerException } from '../../../common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../../../common/error/not.found.timer.exception';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class MafiaCountdownTimer implements CountdownTimer {

  private readonly stopSignals = new Map<GameRoom, Subject<any>>();
  private readonly pauses = new Map<GameRoom, boolean>();

  async start(room: GameRoom, situation: string): Promise<any> {
    console.log(1);
    if (this.stopSignals.has(room)) {
      throw new DuplicateTimerException();
    }
    console.log(2);
    this.stopSignals.set(room, new Subject());
    console.log(3);
    this.pauses.set(room, false);
    console.log(4);
    let timeLeft: number = TIMEOUT_SITUATION[situation];
    console.log(5);
    const currentSignal = this.stopSignals.get(room);
    console.log(6);
    let paused = this.pauses.get(room);
    console.log(7);
    return new Promise<void>((resolve) => {
      interval(1000).pipe(
        takeUntil(currentSignal),
        takeWhile(() => timeLeft > 0 && !paused),
      ).subscribe({
        next: () => {
          console.log(8);
          paused = this.pauses.get(room);
          room.sendAll('countdown', {
            situation: situation,
            timeLeft: timeLeft,
          });
          timeLeft--;
        },
        complete: () => {
          room.sendAll('countdown-exit', {
            situation: situation,
            timeLeft: timeLeft,
          });
          this.stop(room);
          resolve();
        },
      });
    });
  }

  private pause(room: GameRoom): void {
    this.pauses.set(room, true);
  }

  private cleanup(room: GameRoom): void {
    const signal = this.stopSignals.get(room);
    if (!signal) {
      throw new NotFoundTimerException();
    }
    signal.next(null);
    signal.complete();
    this.stopSignals.delete(room);
    this.pauses.delete(room);
  }

  stop(room: GameRoom): void {
    if (!this.pauses.has(room)) {
      return;
    }
    this.pause(room);
    this.cleanup(room);
  }

}