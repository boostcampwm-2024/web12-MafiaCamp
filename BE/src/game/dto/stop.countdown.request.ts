import { GameRoom } from '../../game-room/model/game-room.model';

export class StopCountdownRequest {
  constructor(readonly room: GameRoom) {
  }
}