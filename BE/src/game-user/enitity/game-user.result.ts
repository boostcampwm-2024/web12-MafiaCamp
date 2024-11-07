export const GAME_USER_RESULT = {
  WIN: 'WIN',
  LOSE: 'LOSE',
} as const;

export type GAME_USER_RESULT = typeof GAME_USER_RESULT[keyof typeof GAME_USER_RESULT];