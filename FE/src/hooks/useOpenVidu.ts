import { Role } from '@/constants/role';
import { useSocketStore } from '@/stores/socketStore';
import { GamePublisher } from '@/types/gamePublisher';
import { GameSubscriber } from '@/types/gameSubscriber';
import {
  OpenVidu,
  Publisher,
  StreamManager,
  Subscriber,
  VideoInsertMode,
} from 'openvidu-browser';
import { Reducer, useEffect, useReducer } from 'react';

type State = {
  isGameStarted: boolean;
  gamePublisher: GamePublisher;
  gameSubscribers: GameSubscriber[];
};

type Action =
  | { type: 'PARTICIPATE'; payload: { participantList: string[] } }
  | { type: 'START_GAME'; payload: { publisher: Publisher } }
  | { type: 'SUBSCRIBE'; payload: { subscriber: Subscriber } }
  | { type: 'UNSUBSCRIBE'; payload: { streamManager: StreamManager } }
  | { type: 'CHANGE_PUBLISHER_ROLE'; payload: { role: Role } }
  | { type: 'CHANGE_PUBLISHER_AUDIO'; payload: { audioEnabled: boolean } }
  | { type: 'CHANGE_PUBLISHER_VIDEO'; payload: { videoEnabled: boolean } }
  | { type: 'CHANGE_PUBLISHER_VOTES'; payload: { votes: number } }
  | {
      type: 'CHANGE_PUBLISHER_CANDIDATE_STATUS';
      payload: { isCandidate: boolean };
    }
  | { type: 'ELIMINATE_PUBLISHER' }
  | {
      type: 'CHANGE_SUBSCRIBER_ROLE';
      payload: { nickname: string; role: Role };
    }
  | {
      type: 'CHANGE_SUBSCRIBER_AUDIO';
      payload: { index: number; audioEnabled: boolean };
    }
  | {
      type: 'CHANGE_SUBSCRIBER_VIDEO';
      payload: { index: number; videoEnabled: boolean };
    }
  | {
      type: 'CHANGE_SUBSCRIBER_VOTES';
      payload: { nickname: string; votes: number };
    }
  | {
      type: 'CHANGE_SUBSCRIBER_CANDIDATE_STATUS';
      payload: { nickname: string; isCandidate: boolean };
    }
  | { type: 'INITIALIZE_VOTES' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PARTICIPATE':
      return {
        ...state,
        gameSubscribers: action.payload.participantList.map((participant) => ({
          participant: null,
          nickname: participant,
          role: null,
          audioEnabled: false,
          videoEnabled: false,
          votes: 0,
          isCandidate: false,
        })),
      };

    case 'START_GAME':
      return {
        ...state,
        isGameStarted: true,
        gamePublisher: {
          ...state.gamePublisher,
          participant: action.payload.publisher,
          audioEnabled: true,
          videoEnabled: true,
        },
      };

    case 'SUBSCRIBE':
      const index = state.gameSubscribers.findIndex(
        (gameSubscriber) =>
          gameSubscriber.nickname ===
          action.payload.subscriber.stream.connection.data.split('%/%')[0],
      );

      if (index === -1) {
        return state;
      }

      /* eslint-disable indent */
      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber, idx) =>
          idx === index
            ? {
                ...gameSubscriber,
                participant: action.payload.subscriber,
                audioEnabled: true,
                videoEnabled: true,
              }
            : gameSubscriber,
        ),
      };

    case 'UNSUBSCRIBE':
      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber) =>
          gameSubscriber.participant === action.payload.streamManager
            ? {
                ...gameSubscriber,
                participant: null,
                audioEnabled: false,
                videoEnabled: false,
              }
            : gameSubscriber,
        ),
      };
    /* eslint-enable indent */

    case 'CHANGE_PUBLISHER_ROLE':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          role: action.payload.role,
        },
      };

    case 'CHANGE_PUBLISHER_AUDIO':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          audioEnabled: action.payload.audioEnabled,
        },
      };

    case 'CHANGE_PUBLISHER_VIDEO':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          videoEnabled: action.payload.videoEnabled,
        },
      };

    case 'CHANGE_PUBLISHER_VOTES':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          votes: action.payload.votes,
        },
      };

    case 'CHANGE_PUBLISHER_CANDIDATE_STATUS':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          isCandidate: action.payload.isCandidate,
        },
      };

    case 'ELIMINATE_PUBLISHER':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          participant: null,
          audioEnabled: false,
          videoEnabled: false,
        },
      };

    case 'CHANGE_SUBSCRIBER_ROLE': {
      const index = state.gameSubscribers.findIndex(
        (gameSubscriber) => gameSubscriber.nickname === action.payload.nickname,
      );

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber, idx) =>
          idx === index
            ? { ...gameSubscriber, role: action.payload.role }
            : gameSubscriber,
        ),
      };
    }

    case 'CHANGE_SUBSCRIBER_AUDIO':
      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber, index) =>
          index === action.payload.index
            ? { ...gameSubscriber, audioEnabled: action.payload.audioEnabled }
            : gameSubscriber,
        ),
      };

    case 'CHANGE_SUBSCRIBER_VIDEO':
      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber, index) =>
          index === action.payload.index
            ? { ...gameSubscriber, videoEnabled: action.payload.videoEnabled }
            : gameSubscriber,
        ),
      };

    case 'CHANGE_SUBSCRIBER_VOTES': {
      const index = state.gameSubscribers.findIndex(
        (gameSubscriber) => gameSubscriber.nickname === action.payload.nickname,
      );

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber, idx) =>
          idx === index
            ? { ...gameSubscriber, votes: action.payload.votes }
            : gameSubscriber,
        ),
      };
    }

    case 'CHANGE_SUBSCRIBER_CANDIDATE_STATUS': {
      const index = state.gameSubscribers.findIndex(
        (gameSubscriber) => gameSubscriber.nickname === action.payload.nickname,
      );

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        gameSubscribers: state.gameSubscribers.map((gameSubscriber, idx) =>
          idx === index
            ? { ...gameSubscriber, isCandidate: action.payload.isCandidate }
            : gameSubscriber,
        ),
      };
    }

    case 'INITIALIZE_VOTES':
      return {
        ...state,
        gamePublisher: {
          ...state.gamePublisher,
          votes: 0,
          isCandidate: false,
        },
        gameSubscribers: state.gameSubscribers.map((gameSubscriber) => ({
          ...gameSubscriber,
          votes: 0,
          isCandidate: false,
        })),
      };

    default:
      throw new Error('Unknown action type');
  }
};

export const useOpenVidu = () => {
  const { nickname, socket, session, setState } = useSocketStore();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    isGameStarted: false,
    gamePublisher: {
      participant: null,
      nickname: nickname,
      role: null,
      audioEnabled: false,
      videoEnabled: false,
      votes: 0,
      isCandidate: false,
    },
    gameSubscribers: [],
  });

  const toggleAudio = () => {
    if (!state.gamePublisher) {
      return;
    }

    if (state.gamePublisher.audioEnabled) {
      dispatch({
        type: 'CHANGE_PUBLISHER_AUDIO',
        payload: { audioEnabled: false },
      });
      state.gamePublisher.participant?.publishAudio(false);
    } else {
      dispatch({
        type: 'CHANGE_PUBLISHER_AUDIO',
        payload: { audioEnabled: true },
      });
      state.gamePublisher.participant?.publishAudio(true);
    }
  };

  const toggleVideo = () => {
    if (!state.gamePublisher) {
      return;
    }

    if (state.gamePublisher.videoEnabled) {
      dispatch({
        type: 'CHANGE_PUBLISHER_VIDEO',
        payload: { videoEnabled: false },
      });
      state.gamePublisher.participant?.publishVideo(false);
    } else {
      dispatch({
        type: 'CHANGE_PUBLISHER_VIDEO',
        payload: { videoEnabled: true },
      });
      state.gamePublisher.participant?.publishVideo(true);
    }
  };

  const changePublisherRole = (role: Role) => {
    dispatch({ type: 'CHANGE_PUBLISHER_ROLE', payload: { role } });
  };

  const changePublisherVotes = (votes: number) => {
    dispatch({ type: 'CHANGE_PUBLISHER_VOTES', payload: { votes } });
  };

  const changePublisherCandidateStatus = (isCandidate: boolean) => {
    dispatch({
      type: 'CHANGE_PUBLISHER_CANDIDATE_STATUS',
      payload: { isCandidate },
    });
  };

  const eliminatePublisher = () => {
    state.gamePublisher?.participant?.publishAudio(false);
    state.gamePublisher?.participant?.publishVideo(false);
    session?.unpublish(state.gamePublisher.participant!);
    dispatch({ type: 'ELIMINATE_PUBLISHER' });
  };

  const changeSubscriberRole = (nickname: string, role: Role) => {
    dispatch({ type: 'CHANGE_SUBSCRIBER_ROLE', payload: { nickname, role } });
  };

  const changeSubscriberVotes = (nickname: string, votes: number) => {
    dispatch({ type: 'CHANGE_SUBSCRIBER_VOTES', payload: { nickname, votes } });
  };

  const changeSubscriberCandidateStatus = (
    nickname: string,
    isCandidate: boolean,
  ) => {
    dispatch({
      type: 'CHANGE_SUBSCRIBER_CANDIDATE_STATUS',
      payload: { nickname, isCandidate },
    });
  };

  const initializeVotes = () => {
    dispatch({ type: 'INITIALIZE_VOTES' });
  };

  useEffect(() => {
    // 게임 참가
    socket?.on('participants', (participants: string[]) => {
      dispatch({
        type: 'PARTICIPATE',
        payload: {
          participantList: participants.filter(
            (participant) => participant !== nickname,
          ),
        },
      });
    });

    (async () => {
      try {
        // OpenVidu 객체 생성
        const openvidu = new OpenVidu();

        /**
         * 세션 초기화 (아직 연결되지 않은 상태)
         * - WebRTC 연결을 위한 로컬 객체 생성
         * - 이벤트 핸들러를 등록할 수 있는 인터페이스 제공
         */
        const session = openvidu.initSession();

        // 연결 중 에러 발생 시
        session.on('exception', (exception) => {
          console.warn(exception);
        });

        setState({ session });

        socket?.on(
          'video-info',
          async (data: { token: string; sessionId: string }) => {
            /**
             * 토큰을 사용하여 실제 연결 수립
             * - OpenVidu 서버와 WebRTC 연결 설정
             * - 인증 및 미디어 서버와의 초기 핸드셰이크
             */
            await session.connect(data.token, nickname);

            // 로컬 스트림(자신의 비디오/오디오) 초기화
            const publisher = await openvidu.initPublisherAsync(undefined, {
              audioSource: undefined, // 기본 마이크
              videoSource: undefined, // 기본 카메라
              publishAudio: true, // 오디오 활성화
              publishVideo: true, // 카메라 활성화
              resolution: '640x480', // 해상도 설정
              frameRate: 30, // FPS 설정
              insertMode: VideoInsertMode.APPEND, // 비디오 요소 추가 방식
              mirror: false, // 미러링 여부
            });

            /**
             * 스트림 발행 시작
             * - 다른 참가자들이 내 스트림을 볼 수 있게 됨
             */
            await session.publish(publisher);
            dispatch({ type: 'START_GAME', payload: { publisher } });
          },
        );
      } catch (error) {
        console.error(`Error joining session: ${error}`);
      }
    })();

    return () => {
      socket?.off('participants');
      socket?.off('video-info');
    };
  }, [nickname, setState, socket]);

  useEffect(() => {
    return () => {
      if (session) {
        session.disconnect();
        setState({ session: null });
      }
    };
  }, [session, setState]);

  useEffect(() => {
    if (session) {
      /**
       * 이벤트 핸들러 설정
       * - 다른 참가자의 스트림이 생성될 때
       */
      session.on('streamCreated', (event) => {
        // 자동으로 새 스트림 구독
        const subscriber = session.subscribe(event.stream, undefined);
        dispatch({ type: 'SUBSCRIBE', payload: { subscriber } });
      });

      // 다른 참가자의 오디오/비디오 상태가 변경될 때
      session.on('streamPropertyChanged', (event) => {
        const index = state.gameSubscribers.findIndex(
          (gameSubscriber) =>
            gameSubscriber.participant === event.stream.streamManager,
        );

        if (index === -1) {
          return;
        }

        switch (event.changedProperty) {
          case 'audioActive':
            dispatch({
              type: 'CHANGE_SUBSCRIBER_AUDIO',
              payload: { index, audioEnabled: event.newValue as boolean },
            });
            break;
          case 'videoActive':
            dispatch({
              type: 'CHANGE_SUBSCRIBER_VIDEO',
              payload: { index, videoEnabled: event.newValue as boolean },
            });
            break;
          default:
            break;
        }
      });

      // 참가자의 스트림이 제거될 때
      session.on('streamDestroyed', (event) => {
        dispatch({
          type: 'UNSUBSCRIBE',
          payload: { streamManager: event.stream.streamManager },
        });
      });
    }

    return () => {
      if (session) {
        session.off('streamCreated');
        session.off('streamPropertyChanged');
        session.off('streamDestroyed');
      }
    };
  }, [session, state.gameSubscribers]);

  return {
    isGameStarted: state.isGameStarted,
    gamePublisher: state.gamePublisher,
    gameSubscribers: state.gameSubscribers,
    toggleAudio,
    toggleVideo,
    changePublisherRole,
    changePublisherVotes,
    changePublisherCandidateStatus,
    eliminatePublisher,
    changeSubscriberRole,
    changeSubscriberVotes,
    changeSubscriberCandidateStatus,
    initializeVotes,
  };
};
