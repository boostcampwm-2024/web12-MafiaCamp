import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { MAFIA_ROLE } from '../../mafia-role';

export const GAME_MANAGER = Symbol('GAME_MANAGER');

export interface GameManager {

  register(gameRoom: GameRoom, players: Map<GameClient, MAFIA_ROLE>): void;

  registerBallotBox(gameRoom: GameRoom): void;

  vote(gameRoom: GameRoom, from: GameClient, to: GameClient): void;

  cancelVote(gameRoom: GameRoom, from: GameClient, to: GameClient): void;

  primaryVoteResult(gameRoom: GameRoom): void;

  finalVoteResult(gameRoom: GameRoom): void;
}