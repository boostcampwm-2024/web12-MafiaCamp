import { GameRoom } from 'src/game-room/entity/game-room.model';
import { GameState } from './states/state';

export class GameContext {
  private state: GameState;

  constructor(readonly room: GameRoom) {}

  async run(): Promise<void> {
    await this.state.run(this);
  }

  setState(state: GameState) {
    this.state = state;
  }
}
