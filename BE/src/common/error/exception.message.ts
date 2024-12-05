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
    '해당하는 게임-유저를 찾을 수 없습니다. 다시 시도해주세요.',
  DUPLICATE_TIMER_EXCEPTION:
    '이미 실행중인 타이머가 존재합니다. 다시 시도할 수 없습니다.',
  NOT_FOUND_TIMER_EXCEPTION:
    '해당하는 타이머를 찾을 수 없습니다. 잘못된 시도입니다.',
  NOT_FOUND_GAME_ROOM_EXCEPTION:
    '해당하는 게임룸을 찾을 수 없습니다. 다시 시도해주세요.',
  NOT_FOUND_BALLOT_BOX_EXCEPTION:
    '해당하는 투표함을 찾을 수 없습니다. 다시 시도해주세요.',
  UNAUTHORIZED_USER_BALLOT_EXCEPTION:
    '해당 유저는 투표할 수 있는 권한이 없습니다. 다시 시도해주세요.',
  UNAUTHORIZED_USER_SELECT_EXCEPTION:
    '해당 유저는 선택할 수 있는 권한이 없습니다. 다시 시도해주세요.',
  UNAUTHORIZED_MAFIA_SELECT_EXCEPTION:
    '마피아가 아닌 사용자는 이 작업을 수행할 수 없습니다.',
  CANNOT_SELECT_MAFIA_EXCEPTION:
    '마피아는 살아있는 시민들만 선택할 수 있습니다. 다시 시도해주세요.',
  DUPLICATE_NICKNAME_EXCEPTION:
    '해당 닉네임을 사용하는 유저가 있습니다. 다른 닉네임으로 시도해주세요',
  UNAUTHORIZED_USER_EXCEPTION:
    '권한이 없는 유저입니다. 다시 시도해주세요.',
  CANNOT_SELECT_USER_EXCEPTION:
    '살아있는 사용자만 선택할 수 있습니다. 다시 시도해주세요.',
  NOT_FOUND_MAFIA_SELECT_LOG:
    '마피아의 타겟 기록이 비어 있습니다. 게임 상태를 다시 확인해주세요.',
  NOT_FOUND_OPENVIDU_SESSION:
    '해당하는 OpenVidu 세션을 찾을 수 없습니다. 다시 시도해주세요.',
  FAILED_TO_CLOSE_OPENVIDU_SESSION:
    'OpenVidu 세션을 닫는 데 실패했습니다. 다시 시도해주세요.',
  FAILED_TO_CREATE_OPENVIDU_SESSION:
    'OpenVidu 세션을 생성하는 데 실패했습니다. 다시 시도해주세요.',
  FAILED_TO_GENERATE_OPENVIDU_TOKEN:
    'OpenVidu 토큰을 생성하는 데 실패했습니다. 다시 시도해주세요.',
  FAILED_TO_DISCONNECT_OPENVIDU_PARTICIPANT:
    '참가자 연결 해제에 실패했습니다. 다시 시도해주세요.',
  FAILED_TO_FETCH_OPENVIDU_PARTICIPANT_LIST:
    '참가자 목록을 조회하는 데 실패했습니다. 다시 시도해주세요.',
  INVALID_PASSWORD_EXCEPTION:
    '비밀번호가 일치하지 않습니다. 다시 시도해주세요.',
  DUPLICATE_LOGIN_USER_EXCEPTION:
    '해당 유저는 로그인된 상태입니다. 로그아웃하고 다시 시도해주세요.',
  NOT_FOUND_DOCTOR_EXCEPTION:
    '해당 의사를 찾을 수 없습니다. 게임 상태를 다시 확인해주세요.',
  NOT_FOUND_POLICE_EXCEPTION:
    '해당 경찰을 찾을 수 없습니다. 게임 상태를 다시 확인해주세요.',
  DUPLICATE_GAME_CONTEXT_EXCEPTION:
  '이미 실행중인 게임 컨텍스트가 존재합니다. 다시 시도할 수 없습니다.'

} as const;
