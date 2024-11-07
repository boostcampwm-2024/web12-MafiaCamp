import { MAFIA_ROLE } from './mafia.role';

export const JOB_FACTORY = Symbol('JOB_FACTORY');
export interface JobFactory {
  allocateGameRoles(playerIds: Array<number>): Record<number, MAFIA_ROLE>;
}