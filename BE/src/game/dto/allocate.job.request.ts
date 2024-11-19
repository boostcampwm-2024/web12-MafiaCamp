import { GameRoom } from '../../game-room/entity/game-room.model';

export class AllocateJobRequest {

  constructor(readonly gameRoom:GameRoom) {
  }

}
