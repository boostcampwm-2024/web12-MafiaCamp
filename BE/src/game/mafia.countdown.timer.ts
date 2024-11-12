import { CountdownTimer } from './countdown.timer';
import { Injectable } from '@nestjs/common';
import { TIMEOUT_SITUATION } from './timeout.situation';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { DuplicateTimerException } from '../common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../common/error/not.found.timer.exception';
import { GameRoom } from '../game-room/model/game-room.model';

@Injectable()
export class MafiaCountdownTimer implements CountdownTimer {

  private readonly stopSignals: Record<GameRoom, Subject<any>>;
  private readonly pauses: Record<GameRoom, boolean>;

  constructor() {
    this.stopSignals = {};
    this.pauses = {};
  }

  start(room: GameRoom, situation: string): void {
    if (this.stopSignals[room]) {
      throw new DuplicateTimerException();
    }

    this.stopSignals.room = new Subject();
    this.pauses.room = false;

    let timeLeft: number = TIMEOUT_SITUATION[situation];

    interval(1000).pipe(
      takeUntil(this.stopSignals[room]),
      takeWhile(() => timeLeft > 0 && !this.pauses[room]),
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
    this.pauses[room] = true;
  }

  private cleanup(room: GameRoom): void {
    if (this.stopSignals[room]) {
      this.stopSignals[room].next();
      this.stopSignals[room].complete();
      delete this.stopSignals[room];
      delete this.pauses[room];
    }

    throw new NotFoundTimerException();
  }

  stop(room: GameRoom): void {
    this.pause(room);
    this.cleanup(room);
  }

}