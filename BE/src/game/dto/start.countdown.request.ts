import { GameRoom } from '../../game-room/entity/game-room.model';

export class StartCountdownRequest {
  constructor(readonly room: GameRoom, readonly situation: string) {
  }
}