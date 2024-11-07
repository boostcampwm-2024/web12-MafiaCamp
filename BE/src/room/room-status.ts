export const RoomStatus = {
    READY: 'READY',
    RUNNING: 'RUNNING',
    DONE: 'DONE',
  } as const;
  
export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];