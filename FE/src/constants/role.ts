export type Role = 'MAFIA' | 'POLICE' | 'DOCTOR' | 'CITIZEN';

export const ROLE = {
  MAFIA: '마피아',
  POLICE: '경찰',
  DOCTOR: '의사',
  CITIZEN: '시민',
} as const;
