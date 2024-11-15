import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';

export const VOTE_MAFIA_USECASE = Symbol('VOTE_MAFIA_USECASE');

export interface VoteMafiaUsecase {
  registerBallotBox(gameRoom: GameRoom): Promise<void>;

  vote(gameRoom: GameRoom, from: GameClient, to: GameClient): Promise<void>;

  cancelVote(gameRoom: GameRoom, from: GameClient, to: GameClient): Promise<void>;

  primaryVoteResult(gameRoom: GameRoom): Promise<void>;

  finalVoteResult(gameRoom: GameRoom): Promise<void>;
}