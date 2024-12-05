import { GameRoom } from '../../../game-room/entity/game-room.model';

export const POLICE_INVESTIGATE_USECASE = Symbol('POLICE_INVESTIGATE_USECASE');

export interface PoliceInvestigateUsecase {
  isPoliceAlive(gameRoom: GameRoom): Promise<boolean>;
  executePolice(gameRoom: GameRoom, police: string, criminal: string): Promise<void>;
}