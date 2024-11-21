import { GameContext } from '../game-context';

export type TransitionHandler = (nextState: GameState) => void;

export abstract class GameState {
  abstract handle(context: GameContext, next: TransitionHandler);

  async run(context: GameContext) {
    const next = (nextState: GameState) => {
      context.setState(nextState);
      context.run();
    };
    await this.handle(context, next);
  }
}
