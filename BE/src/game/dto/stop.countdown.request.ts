import { GameRoom } from '../../game-room/entity/game-room.model';

export class StopCountdownRequest {
  constructor(readonly room: GameRoom) {
  }
}