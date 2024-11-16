import { GameRoom } from '../../../game-room/entity/game-room.model';
import { VOTE_STATE } from '../../vote-state';

export const VOTE_MAFIA_USECASE = Symbol('VOTE_MAFIA_USECASE');

export interface VoteMafiaUsecase {
  registerBallotBox(gameRoom: GameRoom): Promise<void>;

  vote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  primaryVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE>;

  finalVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE>;
}