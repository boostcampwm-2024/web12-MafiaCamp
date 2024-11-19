export const KILL_OPTION = {
  VOTE: 'vote',
  MAFIA_KILL: 'mafia-kill',
} as const;

export type KILL_OPTION = (typeof KILL_OPTION)[keyof typeof KILL_OPTION];
