import { CountdownTimer } from './countdown.timer';
import { Injectable } from '@nestjs/common';
import { TIMEOUT_SITUATION } from '../../timeout.situation';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { DuplicateTimerException } from '../../../common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../../../common/error/not.found.timer.exception';
import { GameRoom } from '../../../game-room/entity/game-room.model';

@Injectable()
export class MafiaCountdownTimer implements CountdownTimer {

  private readonly stopSignals= new Map<GameRoom, Subject<any>>();
  private readonly pauses= new Map<GameRoom, boolean>();

  start(room: GameRoom, situation: string): Promise<void> {
    if (this.stopSignals.has(room)) {
      throw new DuplicateTimerException();
    }

    this.stopSignals.set(room, new Subject());
    this.pauses.set(room, false);

    let timeLeft: number = TIMEOUT_SITUATION[situation];

    return new Promise((resolve) => {
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
      // 기존에는 signal 유무와 상관없이 항상 Exception이 터지는 코드라서 수정하였습니다.
      throw new NotFoundTimerException();
    }
    signal.next(null);
    signal.complete();
    this.stopSignals.delete(room);
    this.pauses.delete(room);
  }

  stop(room: GameRoom): void {
    this.pause(room);
    this.cleanup(room);
  }

}