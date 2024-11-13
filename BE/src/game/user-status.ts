export const USER_STATUS = {
  ALIVE: 'ALIVE',
  DIE: 'DIE'
} as const;

export type USER_STATUS = (typeof USER_STATUS)[keyof typeof USER_STATUS];
