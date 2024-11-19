import { Injectable } from '@nestjs/common';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import { FinishGameUsecase } from './finish-game.usecase';
import { GAME_HISTORY_RESULT } from 'src/game/entity/game-history.result';
import { MAFIA_ROLE } from 'src/game/mafia-role';

@Injectable()
export class FinishGameService implements FinishGameUsecase {
  finish(room: GameRoom): void {
    this.sendResult(room);
    return;
  }

  private sendResult(room: GameRoom) {
    const result = room.result;
    const clients = room.clients;
    clients.forEach(c => {
      const flag = result === GAME_HISTORY_RESULT.MAFIA ? c.job === MAFIA_ROLE.MAFIA : c.job !== MAFIA_ROLE.MAFIA;
      c.send('game-result', {
        win: flag
      })
    });
  }
}