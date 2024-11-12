import { GameRoom } from '../game-room/model/game-room.model';

export const COUNTDOWN_TIMER = Symbol('COUNTDOWN_TIMER');

export interface CountdownTimer {
  start(room: GameRoom, situation: string): void;

  stop(room: GameRoom): void;
}