'use client';

import { ROLE, Role } from '@/constants/role';
import { Situation, SITUATION_MESSAGE } from '@/constants/situation';
import { useParticipantListStore } from '@/stores/participantListStore';
import { useSocketStore } from '@/stores/socketStore';
import { useOpenVidu } from './useOpenVidu';
import { Reducer, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { TOAST_OPTION } from '@/constants/toastOption';
import { useRouter } from 'next/navigation';
import { useTickingTimerAudio } from './useTickingTimerAudio';

type State = {
  situation: Situation | null;
  timeLeft: number;
  target: string | null;
  invalidityCount: number;
  gameResultVisible: boolean;
  gameResult: 'WIN' | 'LOSE';
  playerInfoList: {
    nickname: string;
    role: Role;
    status: 'ALIVE' | 'DEAD';
  }[];
};

type Action =
  | {
      type: 'SET_GAME_RESULT_VISIBLE';
      payload: { visible: boolean };
    }
  | {
      type: 'FINISH_GAME';
      payload: {
        gameResult: 'WIN' | 'LOSE';
        playerInfoList: {
          nickname: string;
          role: Role;
          status: 'ALIVE' | 'DEAD';
        }[];
      };
    }
  | {
      type: 'SET_TIME';
      payload: { situation: Situation | null; timeLeft: number };
    }
  | { type: 'SET_TARGET'; payload: { target: string | null } }
  | { type: 'SET_INVALIDITY_COUNT'; payload: { invalidityCount: number } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_GAME_RESULT_VISIBLE':
      return { ...state, gameResultVisible: action.payload.visible };
    case 'FINISH_GAME':
      return {
        ...state,
        gameResultVisible: true,
        gameResult: action.payload.gameResult,
        playerInfoList: action.payload.playerInfoList,
      };
    case 'SET_TIME':
      return {
        ...state,
        situation: action.payload.situation,
        timeLeft: action.payload.timeLeft,
      };
    case 'SET_TARGET':
      return { ...state, target: action.payload.target };
    case 'SET_INVALIDITY_COUNT':
      return { ...state, invalidityCount: action.payload.invalidityCount };
    default:
      throw new Error('Unknown action type');
  }
};

export const useGameStatus = (roomId: string) => {
  const { participantList } = useParticipantListStore();
  const { socket } = useSocketStore();
  const router = useRouter();
  const {
    gameStatus,
    gamePublisher,
    gameSubscribers,
    toggleAudio,
    toggleVideo,
    changePublisherStatus,
    changeSubscriberStatus,
    initializeVotes,
    initializeCandidates,
    setAllParticipantsAsCandidates,
    setTargetsOfMafia,
    setTargetsOfPolice,
    eliminatePublisher,
    finishGame,
  } = useOpenVidu(roomId);

  const { playSound, stopSound } = useTickingTimerAudio();

  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    situation: null,
    timeLeft: 0,
    target: null,
    invalidityCount: 0,
    gameResultVisible: false,
    gameResult: 'WIN',
    playerInfoList: [],
  });

  const notifyInfo = (message: string) =>
    toast.info(message, {
      ...TOAST_OPTION,
      toastId: message,
      autoClose: 5000,
    });

  const setTarget = (nickname: string | null) => {
    dispatch({ type: 'SET_TARGET', payload: { target: nickname } });
  };

  const closeGameResultBoard = () => {
    dispatch({ type: 'SET_GAME_RESULT_VISIBLE', payload: { visible: false } });
  };

  useEffect(() => {
    // 웹 사이트를 새로고침하거나 주소창 입력으로 게임 방에 접속하려는 경우 로비 페이지로 강제 이동
    if (!participantList) {
      router.replace('/lobby');
      return;
    }

    const handleBeforeUnload = () => {
      socket?.emit('leave-room', { roomId });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket?.emit('leave-room', { roomId });
    };
  }, [participantList, roomId, router, socket]);

  useEffect(() => {
    // 직업 확인
    socket?.once(
      'player-role',
      (data: { role: Role; another: [string, Role][] | null }) => {
        dispatch({
          type: 'SET_GAME_RESULT_VISIBLE',
          payload: { visible: false },
        });
        changePublisherStatus({ role: data.role });
        data.another?.forEach((value) => {
          changeSubscriberStatus(value[0], { role: value[1] });
        });
      },
    );

    // 카운트 다운
    socket?.on(
      'countdown',
      (data: { situation: Situation; timeLeft: number }) => {
        dispatch({ type: 'SET_TIME', payload: { ...data } });

        if (data.timeLeft === 5 && gamePublisher.isAlive) {
          switch (data.situation) {
            case 'VOTE':
              playSound();
              break;
            case 'MAFIA':
              if (gamePublisher.role === 'MAFIA') {
                playSound();
              }
              break;
            case 'DOCTOR':
              if (gamePublisher.role === 'DOCTOR') {
                playSound();
              }
              break;
            case 'POLICE':
              if (gamePublisher.role === 'POLICE') {
                playSound();
              }
              break;
            default:
              break;
          }
        }
      },
    );

    // 각 단계 시작
    socket?.on('countdown-start', (newSituation: Situation) => {
      stopSound();

      switch (newSituation) {
        case 'INTERMISSION':
          notifyInfo(SITUATION_MESSAGE.INTERMISSION);
          break;
        case 'DISCUSSION':
          notifyInfo(SITUATION_MESSAGE.DISCUSSION);
          break;
        case 'ARGUMENT':
          notifyInfo(SITUATION_MESSAGE.ARGUMENT);
          break;
        case 'VOTE':
          if (state.situation === 'DISCUSSION') {
            notifyInfo(SITUATION_MESSAGE.PRIMARY_VOTE_FIRST_MESSAGE);
            notifyInfo(SITUATION_MESSAGE.PRIMARY_VOTE_SECOND_MESSAGE);
          } else if (state.situation === 'ARGUMENT') {
            notifyInfo(SITUATION_MESSAGE.FINAL_VOTE);
          }
          break;
        case 'MAFIA':
          if (gamePublisher.role === 'MAFIA') {
            setTargetsOfMafia();
          } else {
            initializeCandidates();
          }
          dispatch({ type: 'SET_TARGET', payload: { target: null } });
          notifyInfo(SITUATION_MESSAGE.MAFIA);
          break;
        case 'DOCTOR':
          if (gamePublisher.role === 'DOCTOR') {
            setAllParticipantsAsCandidates();
          } else {
            initializeCandidates();
          }
          dispatch({ type: 'SET_TARGET', payload: { target: null } });
          notifyInfo(SITUATION_MESSAGE.DOCTOR);
          break;
        case 'POLICE':
          if (gamePublisher.role === 'POLICE') {
            setTargetsOfPolice();
          } else {
            initializeCandidates();
          }
          dispatch({ type: 'SET_TARGET', payload: { target: null } });
          notifyInfo(SITUATION_MESSAGE.POLICE);
          break;
        default:
          break;
      }
    });

    // 투표 시작 시 투표 대상 후보자 설정
    socket?.on('send-vote-candidates', (candidates: string[]) => {
      initializeVotes();
      dispatch({ type: 'SET_TARGET', payload: { target: null } });
      dispatch({
        type: 'SET_INVALIDITY_COUNT',
        payload: { invalidityCount: 0 },
      });

      for (const nickname of candidates) {
        if (nickname === gamePublisher.nickname) {
          changePublisherStatus({ isCandidate: true });
        } else {
          changeSubscriberStatus(nickname, { isCandidate: true });
        }
      }
    });

    // 실시간 투표수 확인
    socket?.on('vote-current-state', (data: { [nickname: string]: number }) => {
      for (const [nickname, votes] of Object.entries(data)) {
        if (nickname === 'INVALIDITY') {
          dispatch({
            type: 'SET_INVALIDITY_COUNT',
            payload: { invalidityCount: votes },
          });
        } else if (nickname === gamePublisher.nickname) {
          changePublisherStatus({ votes });
        } else {
          changeSubscriberStatus(nickname, { votes });
        }
      }
    });

    // 1차 투표 결과 확인
    socket?.on('primary-vote-result', (candidates: string[]) => {
      initializeCandidates();
      dispatch({ type: 'SET_TARGET', payload: { target: null } });
      dispatch({
        type: 'SET_INVALIDITY_COUNT',
        payload: { invalidityCount: 0 },
      });

      for (const nickname of candidates) {
        if (nickname === gamePublisher.nickname) {
          changePublisherStatus({ isCandidate: true });
        } else {
          changeSubscriberStatus(nickname, { isCandidate: true });
        }
      }
    });

    // 투표 수가 제일 많은 플레이어 제거
    socket?.on(
      'vote-kill-user',
      (data: { player: string; job: Role } | null) => {
        if (!data) {
          notifyInfo('투표 결과, 아무도 죽지 않았습니다.');
          return;
        }

        if (data.player === gamePublisher.nickname) {
          eliminatePublisher();
        }

        notifyInfo(
          `투표 결과, ${ROLE[data.job]} ${data.player} 님이 사망하였습니다.`,
        );
      },
    );

    // 실시간 마피아 타겟 확인
    if (gamePublisher.role === 'MAFIA') {
      socket?.on('mafia-current-target', (target: string) => {
        dispatch({ type: 'SET_TARGET', payload: { target } });
      });
    }

    // 경찰 조사 결과 확인
    if (gamePublisher.role === 'POLICE') {
      socket?.on(
        'police-investigation-result',
        (data: { criminal: string; criminalJob: Role }) => {
          changeSubscriberStatus(data.criminal, { role: data.criminalJob });
          notifyInfo(`${data.criminal} 님은 ${ROLE[data.criminalJob]}입니다.`);
        },
      );
    }

    // 밤 중 사망한 플레이어 확인
    socket?.on(
      'mafia-kill-result',
      (data: { player: string; job: Role } | null) => {
        if (!data) {
          notifyInfo('지난밤, 아무도 죽지 않았습니다.');
          return;
        }

        if (data.player === gamePublisher.nickname) {
          eliminatePublisher();
        }

        notifyInfo(
          `지난밤, 마피아에 의해 ${ROLE[data.job]} ${data.player} 님이 사망하였습니다.`,
        );
      },
    );

    // 게임 결과 확인
    socket?.on(
      'game-result',
      (data: {
        result: 'WIN' | 'LOSE';
        playerInfo: {
          nickname: string;
          role: Role;
          status: 'ALIVE' | 'DEAD';
        }[];
      }) => {
        notifyInfo('게임이 종료되었습니다.');
        dispatch({
          type: 'SET_TIME',
          payload: { situation: null, timeLeft: 0 },
        });
        finishGame();
        dispatch({
          type: 'FINISH_GAME',
          payload: { gameResult: data.result, playerInfoList: data.playerInfo },
        });
      },
    );

    return () => {
      socket?.off('countdown');
      socket?.off('countdown-start');
      socket?.off('player-role');
      socket?.off('vote-current-state');
      socket?.off('primary-vote-result');
      socket?.off('vote-kill-user');
      socket?.off('mafia-current-target');
      socket?.off('police-investigation-result');
      socket?.off('mafia-kill-result');
      socket?.off('game-result');
    };
  }, [
    changePublisherStatus,
    changeSubscriberStatus,
    eliminatePublisher,
    finishGame,
    gamePublisher.isAlive,
    gamePublisher.nickname,
    gamePublisher.role,
    initializeCandidates,
    initializeVotes,
    playSound,
    setAllParticipantsAsCandidates,
    setTargetsOfMafia,
    setTargetsOfPolice,
    socket,
    state.situation,
    stopSound,
  ]);

  return {
    participantList,
    gamePublisher,
    gameSubscribers,
    gameStatus,
    situation: state.situation,
    timeLeft: state.timeLeft,
    target: state.target,
    invalidityCount: state.invalidityCount,
    gameResult: state.gameResult,
    gameResultVisible: state.gameResultVisible,
    playerInfoList: state.playerInfoList,
    toggleAudio,
    toggleVideo,
    setTarget,
    closeGameResultBoard,
  };
};
