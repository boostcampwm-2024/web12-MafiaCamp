import { Injectable } from '@nestjs/common';
import { GameState, TransitionHandler } from './state';
import { GameContext } from '../game-context';

@Injectable()
export class FinishState extends GameState {

  async handle(context: GameContext, next: TransitionHandler) {
    const room = context.room;
  }
}
