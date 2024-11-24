export type GameStatus = 'READY' | 'RUNNING' | 'DONE';

export const GAME_STATUS = {
  READY: '게임 진행 전',
  RUNNING: '게임 진행 중',
  DONE: '게임 완료',
} as const;
