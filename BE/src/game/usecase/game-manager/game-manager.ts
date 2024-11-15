import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { MAFIA_ROLE } from '../../mafia-role';
import { MutexMap } from '../../../common/utils/mutex-map';

export const GAME_MANAGER = Symbol('GAME_MANAGER');

export interface GameManager {

  register(gameRoom: GameRoom, players: MutexMap<GameClient, MAFIA_ROLE>): Promise<void>;

  registerBallotBox(gameRoom: GameRoom): Promise<void>;

  vote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  cancelVote(gameRoom: GameRoom, from: string, to: string): Promise<void>;

  primaryVoteResult(gameRoom: GameRoom): Promise<void>;

  finalVoteResult(gameRoom: GameRoom): Promise<void>;
}