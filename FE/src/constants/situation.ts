export type Situation =
  | 'INTERMISSION'
  | 'DISCUSSION'
  | 'ARGUMENT'
  | 'VOTE'
  | 'MAFIA'
  | 'DOCTOR'
  | 'POLICE';

export const SITUATION = {
  INTERMISSION: 5,
  DISCUSSION: 150,
  ARGUMENT: 90,
  VOTE: 15,
  MAFIA: 30,
  DOCTOR: 20,
  POLICE: 20,
} as const;
