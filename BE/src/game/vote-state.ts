export const VOTE_STATE = {
  PRIMARY: 'PRIMARY',
  FINAL: 'FINAL',
  INVALIDITY: 'INVALIDITY',
} as const;

export type VOTE_STATE = (typeof VOTE_STATE)[keyof typeof VOTE_STATE];
