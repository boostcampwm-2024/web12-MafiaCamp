import { GameRoom } from 'src/game-room/entity/game-room.model';
import { GameState } from './states/state';

export class GameContext {
  private state: GameState;

  constructor(readonly room: GameRoom) {}

  run() {
    this.state.run(this);
  }

  setState(state: GameState) {
    this.state = state;
  }
}
