import { CountdownTimer } from './countdown.timer';
import { Injectable } from '@nestjs/common';
import { TIMEOUT_SITUATION } from './timeout.situation';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { DuplicateTimerException } from '../common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../common/error/not.found.timer.exception';

@Injectable()
export class MafiaCountdownTimer implements CountdownTimer {

  private readonly stopSignals: Record<string, Subject<any>>;
  private readonly pauses: Record<string, boolean>;

  constructor() {
    this.stopSignals = {};
    this.pauses = {};
  }

  /*
  roomId로 진행을 하지만 Room 객체가 생성되면 migration 할 예정
   */
  start(room: string, situation: string): void {
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
        timeLeft--;
        console.log('이 부분 소켓을 이용해서 계속 룸에 있는 사람들에게 시간을 전송할 예정');
      },
      complete: () => {
        console.log('해당 타이머가 완료되면 소켓을 이용해서 룸에 있는 사람들에게 전송할 예정');
        this.stop(room);
      },
    });
  }

  private pause(room: string):void {
    this.pauses[room] = true;
  }

  private cleanup(room:string):void {
    if (this.stopSignals[room]) {
      this.stopSignals[room].next();
      this.stopSignals[room].complete();
      delete this.stopSignals[room];
      delete this.pauses[room];
    }

    throw new NotFoundTimerException();
  }

  stop(room: string): void {
    this.pause(room);
    this.cleanup(room);
  }

}