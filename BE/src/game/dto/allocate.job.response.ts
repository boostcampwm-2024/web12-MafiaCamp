import { MAFIA_ROLE } from '../mafia.role';

export class AllocateJobResponse {
  readonly userJobs : Record<number, MAFIA_ROLE>;
  constructor(userJobs : Record<number, MAFIA_ROLE>) {
    this.userJobs = userJobs;
  }
}