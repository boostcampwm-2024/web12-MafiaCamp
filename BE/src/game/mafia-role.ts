export const MAFIA_ROLE = {
  MAFIA: 'MAFIA',
  POLICE: 'POLICE',
  DOCTOR: 'DOCTOR',
  CITIZEN: 'CITIZEN',
} as const;

export type MAFIA_ROLE = (typeof MAFIA_ROLE)[keyof typeof MAFIA_ROLE];
