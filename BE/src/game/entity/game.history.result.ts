export const GAME_HISTORY_RESULT =  {
  MAFIA :'MAFIA',
  CITIZEN :'CITIZEN'
} as const;

export type GAME_HISTORY_RESULT = typeof GAME_HISTORY_RESULT[keyof typeof GAME_HISTORY_RESULT];