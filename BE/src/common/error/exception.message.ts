export const EXCEPTION_MESSAGE = {
  GAME_INVALID_PLAYER_COUNT_EXCEPTION: '게임이 시작될 수 있는 유저의 수는 6명에서 8명 사이입니다. 다시 시도해주세요.',
  ROLE_COUNT_NEGATIVE_EXCEPTION: '게임이 시작될 수 있는 직업의 개수가 음수입니다. 다시 시도해주세요.',
  NOT_FOUND_GAME_HISTORY_EXCEPTION: '해당하는 게임 히스토리를 찾을 수 없습니다. 다시 시도해주세요.',
  NOT_FOUND_USER_EXCEPTION: '해당하는 유저를 찾을 수 없습니다. 다시 시도해주세요.',
  NOT_FOUND_GAME_USER_EXCEPTION: '해당하는 게임-유저를 찾을 수 없습니다. 다시 시도해주세요',
  DUPLICATE_TIMER_EXCEPTION: '이미 실행중인 타이머가 존재합니다. 다시 시도할 수 없습니다',
  NOT_FOUND_TIMER_EXCEPTION: '해당하는 타이머를 찾을 수 없습니다. 잘못된 시도입니다.',
} as const;
