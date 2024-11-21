export const KILL_OPTION = {
  VOTE: 'VOTE',
  MAFIA_KILL: 'MAFIA_KILL',
} as const;

export type KILL_OPTION = (typeof KILL_OPTION)[keyof typeof KILL_OPTION];
