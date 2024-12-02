import { Injectable } from '@nestjs/common';
import { GameContext } from '../../fsm/game-context';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import { StartGameUsecase } from './start-game.usecase';
import { SetUpState } from '../../fsm/states/set-up.state';

@Injectable()
export class StartGameService implements StartGameUsecase {
  constructor(
    private readonly setUpState: SetUpState
  ) {
  }

  async start(room: GameRoom): Promise<void> {
    const context = new GameContext(room);
    context.setState(this.setUpState);
    await context.run();
  }
}