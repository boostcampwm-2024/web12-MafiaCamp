import { CountdownTimer } from './countdown.timer';
import { Injectable } from '@nestjs/common';
import { TIMEOUT_SITUATION } from '../../timeout.situation';
import { interval, Subject, takeUntil, takeWhile } from 'rxjs';
import { DuplicateTimerException } from '../../../common/error/duplicate.timer.exception';
import { NotFoundTimerException } from '../../../common/error/not.found.timer.exception';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { MutexMap } from '../../../common/utils/mutex-map';

@Injectable()
export class MafiaCountdownTimer implements CountdownTimer {

  private readonly stopSignals = new MutexMap<GameRoom, Subject<any>>();
  private readonly pauses = new MutexMap<GameRoom, boolean>();

  async start(room: GameRoom, situation: string): Promise<void> {
    if (await this.stopSignals.has(room)) {
      throw new DuplicateTimerException();
    }

    await this.stopSignals.set(room, new Subject());
    await this.pauses.set(room, false);

    let timeLeft: number = TIMEOUT_SITUATION[situation];
    const currentSignal = await this.stopSignals.get(room);
    let paused = await this.pauses.get(room);
    return new Promise<void>((resolve) => {
      interval(1000).pipe(
        takeUntil(currentSignal),
        takeWhile(() => timeLeft > 0 && !paused),
      ).subscribe({
        next: async () => {
          paused = await this.pauses.get(room);
          room.sendAll('countdown', {
            situation: situation,
            timeLeft: timeLeft,
          });
          timeLeft--;
        },
        complete: async () => {
          room.sendAll('countdown-exit', {
            situation: situation,
            timeLeft: timeLeft,
          });
          await this.stop(room);
          resolve();
        },
      });
    });
  }

  private async pause(room: GameRoom): Promise<void> {
    await this.pauses.set(room, true);
  }

  private async cleanup(room: GameRoom): Promise<void> {
    const signal = await this.stopSignals.get(room);
    if (!signal) {
      // 기존에는 signal 유무와 상관없이 항상 Exception이 터지는 코드라서 수정하였습니다.
      throw new NotFoundTimerException();
    }
    signal.next(null);
    signal.complete();
    await this.stopSignals.delete(room);
    await this.pauses.delete(room);
  }

  async stop(room: GameRoom): Promise<void> {
    await this.pause(room);
    await this.cleanup(room);
  }

}