import { Injectable } from '@nestjs/common';
import { GameContext } from '../../fsm/game-context';
import { GameRoom } from 'src/game-room/entity/game-room.model';
import { StartGameUsecase } from './start-game.usecase';
import { SetUpState } from '../../fsm/states/set-up.state';

@Injectable()
export class GameService implements StartGameUsecase {
  constructor(
    private readonly setUpState: SetUpState
  ) {
  }

  startGame(room: GameRoom): void {
    const context = new GameContext(room);
    context.setState(this.setUpState);
    context.run();
  }
}