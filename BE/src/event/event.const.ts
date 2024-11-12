export const Event = {
    ROOM_DATA_CHANGED: 'RoomDataChanged'
} as const;
  
export type Event = (typeof Event)[keyof typeof Event];