export const GameRoomStatus = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    DONE: 'DONE',
  } as const;
  
export type GameRoomStatus = (typeof GameRoomStatus)[keyof typeof GameRoomStatus];