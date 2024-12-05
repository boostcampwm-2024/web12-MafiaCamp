import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { MAFIA_ROLE } from '../../mafia-role';
import { VOTE_STATE } from '../../vote-state';

export const VOTE_MANAGER = Symbol('VOTE_MANAGER');

export interface VoteManager {

  register(gameRoom: GameRoom, players: Map<GameClient, MAFIA_ROLE>): Promise<void>;

  registerBallotBox(gameRoom: GameRoom): Promise<void>;

  vote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  primaryVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE>;

  finalVoteResult(gameRoom: GameRoom): Promise<VOTE_STATE>;
}