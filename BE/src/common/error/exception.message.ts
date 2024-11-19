export const EXCEPTION_MESSAGE = {
  GAME_INVALID_PLAYER_COUNT_EXCEPTION:
    '게임이 시작될 수 있는 유저의 수는 6명에서 8명 사이입니다. 다시 시도해주세요.',
  ROLE_COUNT_NEGATIVE_EXCEPTION:
    '게임이 시작될 수 있는 직업의 개수가 음수입니다. 다시 시도해주세요.',
  NOT_FOUND_GAME_HISTORY_EXCEPTION:
    '해당하는 게임 히스토리를 찾을 수 없습니다. 다시 시도해주세요.',
  NOT_FOUND_USER_EXCEPTION:
    '해당하는 유저를 찾을 수 없습니다. 다시 시도해주세요.',
  NOT_FOUND_GAME_USER_EXCEPTION:
    '해당하는 게임-유저를 찾을 수 없습니다. 다시 시도해주세요',
  DUPLICATE_TIMER_EXCEPTION:
    '이미 실행중인 타이머가 존재합니다. 다시 시도할 수 없습니다',
  NOT_FOUND_TIMER_EXCEPTION:
    '해당하는 타이머를 찾을 수 없습니다. 잘못된 시도입니다.',
  NOT_FOUND_GAME_ROOM_EXCEPTION:
    '해당하는 게임룸을 찾을 수 없습니다. 다시 시도해주세요.',
  NOT_FOUND_BALLOT_BOX_EXCEPTION:
    '해당하는 투표함을 찾을 수 없습니다. 다시 시도해주세요.',
  UNAUTHORIZED_USER_BALLOT_EXCEPTION:
    '해당 유저는 투표할 수 있는 권한이 없습니다. 다시 시도해주세요.',
  UNAUTHORIZED_MAFIA_SELECT_EXCEPTION:
    '마피아가 아닌 사용자는 이 작업을 수행할 수 없습니다.',
  CANNOT_SELECT_MAFIA_EXCEPTION:
    '마피아는 살아있는 시민들만 선택할 수 있습니다. 다시 시도해주세요.',
} as const;
