import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';

export const VOTE_MAFIA_USECASE = Symbol('VOTE_MAFIA_USECASE');

export interface VoteMafiaUsecase {
  registerBallotBox(gameRoom: GameRoom): void;

  vote(gameRoom: GameRoom, from: GameClient, to: GameClient): void;

  cancelVote(gameRoom: GameRoom, from: GameClient, to: GameClient): void;

  primaryVoteResult(gameRoom: GameRoom): void;

  finalVoteResult(gameRoom: GameRoom): void;
}