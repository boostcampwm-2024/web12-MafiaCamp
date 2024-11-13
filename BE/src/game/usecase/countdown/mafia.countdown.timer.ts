import { CountdownTimer } from './countdown.timer';
import { Injectable } from '@nestjs/common';
import { TIMEOUT_SITUATION } from '../../timeout.situation';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { DuplicateTimerException } from '../../../common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../../../common/error/not.found.timer.exception';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class MafiaCountdownTimer implements CountdownTimer {

  private readonly stopSignals: Map<GameRoom, Subject<any>> = new Map<GameRoom, Subject<any>>();
  private readonly pauses: Map<GameRoom, boolean> = new Map<GameRoom, boolean>();

  constructor() {
  }

  start(room: GameRoom, situation: string): void {
    if (this.stopSignals.has(room)) {
      throw new DuplicateTimerException();
    }

    this.stopSignals.set(room, new Subject());
    this.pauses.set(room, false);

    let timeLeft: number = TIMEOUT_SITUATION[situation];

    interval(1000).pipe(
      takeUntil(this.stopSignals.get(room)),
      takeWhile(() => timeLeft > 0 && !this.pauses.get(room)),
    ).subscribe({
      next: () => {
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
      },
    });
  }

  private pause(room: GameRoom): void {
    this.pauses.set(room, true);
  }

  private cleanup(room: GameRoom): void {
    const signal = this.stopSignals.get(room);
    if (signal) {
      signal.next(null);
      signal.complete();
      this.stopSignals.delete(room);
      this.pauses.delete(room);
    }

    throw new NotFoundTimerException();
  }

  stop(room: GameRoom): void {
    this.pause(room);
    this.cleanup(room);
  }

}