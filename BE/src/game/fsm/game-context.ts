import { GameRoom } from 'src/game-room/entity/game-room.model';
import { GameState } from './states/state';

export class GameContext {
  private state: GameState;
  private isTerminated = false;

  constructor(readonly room: GameRoom) {
  }

  async run(): Promise<void> {
    if(this.isTerminated) return;
    await this.state.run(this);
  }

  setState(state: GameState) {
    this.state = state;
  }

  terminate() {
    this.isTerminated = true;
  }

  isGameTerminated(): boolean {
    return this.isTerminated;
  }
}
