import { useSocketStore } from '@/stores/socketStore';
import {
  OpenVidu,
  Publisher,
  Subscriber,
  VideoInsertMode,
} from 'openvidu-browser';
import { useEffect, useState } from 'react';

export const useOpenVidu = () => {
  const { nickname, socket, session, audioEnabled, videoEnabled, setState } =
    useSocketStore();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const toggleAudio = () => {
    if (publisher) {
      publisher.publishAudio(!audioEnabled);
      setState({ audioEnabled: !audioEnabled });
    }
  };

  const toggleVideo = () => {
    if (publisher) {
      publisher.publishVideo(!videoEnabled);
      setState({ videoEnabled: !videoEnabled });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // 1. OpenVidu 객체 생성
        const openvidu = new OpenVidu();

        /**
         * 2. 세션 초기화 (아직 연결되지 않은 상태)
         * - WebRTC 연결을 위한 로컬 객체 생성
         * - 이벤트 핸들러를 등록할 수 있는 인터페이스 제공
         */
        const session = openvidu.initSession();

        /**
         * 3. 이벤트 핸들러 설정
         * - 다른 참가자의 스트림이 생성될 때
         */
        session.on('streamCreated', (event) => {
          // 자동으로 새 스트림 구독
          const subscriber = session.subscribe(event.stream, undefined);
          setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        });

        // 참가자의 스트림이 제거될 때
        session.on('streamDestroyed', (event) => {
          setSubscribers(
            subscribers.filter(
              (subscriber) => subscriber !== event.stream.streamManager,
            ),
          );
        });

        // 연결 중 에러 발생 시
        session.on('exception', (exception) => {
          console.warn(exception);
        });

        setState({ session });

        socket?.on(
          'video-info',
          async (data: { token: string; sessionId: string }) => {
            /**
             * 4. 토큰을 사용하여 실제 연결 수립
             * - OpenVidu 서버와 WebRTC 연결 설정
             * - 인증 및 미디어 서버와의 초기 핸드셰이크
             */
            await session.connect(data.token, nickname);

            // 5. 로컬 스트림(자신의 비디오/오디오) 초기화
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
             * 6. 스트림 발행 시작
             * - 다른 참가자들이 내 스트림을 볼 수 있게 됨
             */
            await session.publish(publisher);
            setPublisher(publisher);
            setIsGameStarted(true);
          },
        );
      } catch (error) {
        console.error(`Error joining session: ${error}`);
      }
    })();

    return () => {
      socket?.off('video-info');

      if (session) {
        session.disconnect();
        setState({ session: null, audioEnabled: true, videoEnabled: true });
        setPublisher(null);
        setSubscribers([]);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isGameStarted,
    publisher,
    subscribers,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
  };
};
