import { MAFIA_ROLE } from '../../mafia-role';
import { GameRoom } from '../../../game-room/entity/game-room.model';
import { GameClient } from '../../../game-room/entity/game-client.model';
import { MutexMap } from '../../../common/utils/mutex-map';

export const JOB_FACTORY = Symbol('JOB_FACTORY');
export interface JobFactory {
  allocateGameRoles(gameRoom: GameRoom): Promise<MutexMap<GameClient, MAFIA_ROLE>>;
}
