export type Situation =
  | 'INTERMISSION'
  | 'DISCUSSION'
  | 'ARGUMENT'
  | 'VOTE'
  | 'MAFIA'
  | 'DOCTOR'
  | 'POLICE';

export const SITUATION = {
  INTERMISSION: 10,
  DISCUSSION: 150,
  ARGUMENT: 90,
  VOTE: 15,
  MAFIA: 30,
  DOCTOR: 20,
  POLICE: 20,
} as const;

export const SITUATION_MESSAGE = {
  INTERMISSION: '잠시 후 게임이 시작됩니다.',
  DISCUSSION: '낮이 되었습니다. 모든 플레이어들은 토론을 진행해 주세요.',
  ARGUMENT:
    '처형 후보가 결정되었습니다. 후보로 결정된 플레이어는 변론을 해주세요.',
  PRIMARY_VOTE:
    '투표를 시작하겠습니다. 마피아라고 생각되는 플레이어를 선택해 주세요.',
  FINAL_VOTE:
    '최종 투표를 시작하겠습니다. 해당 플레이어를 죽일지, 아니면 살릴지 결정해 주세요.',
  MAFIA: '밤이 되었습니다. 마피아들은 제거할 플레이어 한 명을 선택해 주세요.',
  DOCTOR: '의사는 마피아로부터 보호하고 싶은 플레이어 한 명을 선택해 주세요.',
  POLICE: '경찰은 정체를 알고 싶은 플레이어 한 명을 선택해 주세요.',
} as const;
