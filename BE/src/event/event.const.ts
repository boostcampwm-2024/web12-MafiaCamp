export const Event = {
  ROOM_DATA_CHANGED: 'RoomDataChanged',
  USER_DATA_CHANGED: 'UserDataChanged',
} as const;

export type Event = (typeof Event)[keyof typeof Event];
