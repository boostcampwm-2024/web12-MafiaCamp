export const GAME_STATUS = {
  PROGRESS: 'PROGRESS',
  END: 'END',
} as const;

export type GAME_STATUS = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
