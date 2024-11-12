import { GameRoom } from '../../game-room/model/game-room.model';

export class StartCountdownRequest {
  constructor(readonly room: GameRoom, readonly situation: string) {
  }
}