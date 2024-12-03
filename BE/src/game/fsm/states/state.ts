import { GameContext } from '../game-context';

export type TransitionHandler = (nextState: GameState) => void;

export abstract class GameState {
  abstract handle(context: GameContext, next: TransitionHandler);

  async run(context: GameContext) {
    if (context.isGameTerminated()) {
      return;
    }

    const next = (nextState: GameState) => {
      if (context.isGameTerminated()) {
        return;
      }

      context.setState(nextState);
      context.run();
    };
    await this.handle(context, next);
  }
}
