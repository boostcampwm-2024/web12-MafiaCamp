export const Event = {
  ROOM_DATA_CHANGED: 'ROOM_DATA_CHANGED',
  USER_DATA_CHANGED: 'USER_DATA_CHANGED',
} as const;

export type Event = (typeof Event)[keyof typeof Event];
