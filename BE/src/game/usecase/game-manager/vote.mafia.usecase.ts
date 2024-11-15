import { GameRoom } from '../../../game-room/entity/game-room.model';

export const VOTE_MAFIA_USECASE = Symbol('VOTE_MAFIA_USECASE');

export interface VoteMafiaUsecase {
  registerBallotBox(gameRoom: GameRoom): Promise<void>;

  vote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  primaryVoteResult(gameRoom: GameRoom): Promise<void>;

  finalVoteResult(gameRoom: GameRoom): Promise<void>;
}