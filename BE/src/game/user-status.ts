export const USER_STATUS = {
  ALIVE: 'ALIVE',
  DEAD: 'DEAD'
} as const;

export type USER_STATUS = (typeof USER_STATUS)[keyof typeof USER_STATUS];
