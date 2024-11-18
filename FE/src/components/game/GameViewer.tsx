'use client';

import 'react-toastify/dist/ReactToastify.css';
import { useOpenVidu } from '@/hooks/useOpenVidu';
import Bottombar from './Bottombar';
import ChattingList from './ChattingList';
import VideoViewer from './VideoViewer';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import { ROLE, Role } from '@/constants/role';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { Situation } from '@/constants/situation';

interface GameViewerProps {
  roomId: string;
}

const GameViewer = ({ roomId }: GameViewerProps) => {
  // TODO: 하단 코드 리팩토링 필요.

  const { socket } = useSocketStore();
  const {
    isGameStarted,
    gamePublisher,
    gameSubscribers,
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
  } = useOpenVidu();

  const [participantList, setParticipantList] = useState<string[]>([]);
  const [situation, setSituation] = useState<Situation | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [invalidityCount, setInvalidityCount] = useState(0);

  const notifyInfo = (message: string) =>
    toast.info(message, {
      toastId: message,
      position: 'top-center',
      autoClose: 3000,
      closeButton: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });

  useEffect(() => {
    // 방 입장
    socket?.emit('enter-room', { roomId: roomId });
  }, [roomId, socket]);

  useEffect(() => {
    // 게임 참가
    socket?.on('participants', (participants: string[]) => {
      setParticipantList(participants);
    });

    // 카운트 다운
    socket?.on(
      'countdown',
      (data: { situation: Situation; timeLeft: number }) => {
        if (data.situation === 'INTERMISSION' && data.timeLeft === 5) {
          notifyInfo('잠시 후 게임이 시작됩니다.');
        }

        if (data.situation === 'DISCUSSION' && data.timeLeft === 150) {
          notifyInfo(
            '낮이 되었습니다. 모든 플레이어들은 토론을 진행해 주세요.',
          );
        }

        if (data.situation === 'ARGUMENT' && data.timeLeft === 90) {
          notifyInfo(
            '처형 후보가 결정되었습니다. 후보로 결정된 플레이어는 변론을 해주세요.',
          );
        }

        if (data.situation === 'VOTE' && data.timeLeft === 15) {
          if (situation === 'DISCUSSION') {
            notifyInfo(
              '투표를 시작하겠습니다. 마피아라고 생각되는 플레이어를 선택해 주세요.',
            );
          } else if (situation === 'ARGUMENT') {
            notifyInfo(
              '최종 투표를 시작하겠습니다. 해당 플레이어를 죽일지, 아니면 살릴지 결정해 주세요.',
            );
          }
        }

        if (data.situation === 'MAFIA' && data.timeLeft === 30) {
          notifyInfo('마피아들은 제거할 플레이어 한 명을 선택해 주세요.');
        }

        if (data.situation === 'DOCTOR' && data.timeLeft === 20) {
          notifyInfo(
            '의사는 마피아로부터 보호하고 싶은 플레이어 한 명을 선택해 주세요.',
          );
        }

        if (data.situation === 'POLICE' && data.timeLeft === 20) {
          notifyInfo('경찰은 정체를 알고 싶은 플레이어 한 명을 선택해 주세요.');
        }

        setSituation(data.situation);
        setTimeLeft(data.timeLeft);
      },
    );

    // 특정 단계 카운트 다운 종료
    socket?.on(
      'countdown-exit',
      (data: { situation: Situation; timeLeft: number }) => {
        setSituation(data.situation);
        setTimeLeft(data.timeLeft);
      },
    );

    // 직업 확인
    socket?.once(
      'player-role',
      (data: { role: Role; another: [string, Role][] | null }) => {
        changePublisherRole(data.role);

        data.another?.forEach((value) => {
          changeSubscriberRole(value[0], value[1]);
        });
      },
    );

    // 투표 시작 시 투표 대상 후보자 설정
    socket?.on('send-vote-candidates', (candidates: string[]) => {
      initializeVotes();
      setInvalidityCount(0);
      setTarget(null);

      for (const nickname in candidates) {
        if (nickname === gamePublisher?.nickname) {
          changePublisherCandidateStatus(true);
        } else {
          changeSubscriberCandidateStatus(nickname, true);
        }
      }
    });

    // 실시간 투표수 확인
    socket?.on('vote-current-state', (data: { [nickname: string]: number }) => {
      for (const [nickname, votes] of Object.entries(data)) {
        if (nickname === 'INVALIDITY') {
          setInvalidityCount(votes);
        } else if (nickname === gamePublisher?.nickname) {
          changePublisherVotes(votes);
        } else {
          changeSubscriberVotes(nickname, votes);
        }
      }
    });

    // 1차 투표 결과 확인
    socket?.on(
      'primary-vote-result',
      (data: { [nickname: string]: number }) => {
        setTarget(null);

        for (const [nickname, votes] of Object.entries(data)) {
          if (nickname === 'INVALIDITY') {
            setInvalidityCount(votes);
          } else if (nickname === gamePublisher?.nickname) {
            changePublisherVotes(votes);
          } else {
            changeSubscriberVotes(nickname, votes);
          }
        }
      },
    );

    // 투표 수가 제일 많은 플레이어 제거
    socket?.on(
      'vote-kill-user',
      (data: { player: string; job: Role } | null) => {
        if (!data) {
          notifyInfo('처형이 보류되었습니다.');
          return;
        }

        if (data.player === gamePublisher?.nickname) {
          eliminatePublisher();
        }

        notifyInfo(`${ROLE[data.job]} ${data.player} 님이 사망하였습니다.`);
      },
    );

    // 경찰 조사 결과 확인
    socket?.on(
      'police-investigation-result',
      (data: { criminal: string; criminalJob: Role }) => {
        changeSubscriberRole(data.criminal, data.criminalJob);
        notifyInfo(`${data.criminal} 님은 ${data.criminalJob}입니다.`);
      },
    );

    return () => {
      socket?.off('participants');
      socket?.off('countdown');
      socket?.off('countdown-exit');
      socket?.off('player-role');
      socket?.off('vote-current-state');
      socket?.off('primary-vote-result');
      socket?.off('vote-kill-user');
      socket?.off('police-investigation-result');
    };
  }, [
    changePublisherCandidateStatus,
    changePublisherRole,
    changePublisherVotes,
    changeSubscriberCandidateStatus,
    changeSubscriberRole,
    changeSubscriberVotes,
    eliminatePublisher,
    gamePublisher?.nickname,
    initializeVotes,
    situation,
    socket,
  ]);

  return (
    <div className='absolute left-0 top-0 h-screen w-screen overflow-x-hidden'>
      <ToastContainer style={{ width: '40rem' }} />
      <VideoViewer
        roomId={roomId}
        isGameStarted={isGameStarted}
        participantList={participantList}
        situation={situation}
        gamePublisher={gamePublisher}
        gameSubscribers={gameSubscribers}
        target={target}
        invalidityCount={invalidityCount}
        setTarget={(nickname: string | null) => setTarget(nickname)}
      />
      <Bottombar
        roomId={roomId}
        totalParticipants={participantList.length}
        situation={situation}
        timeLeft={timeLeft}
        audioEnabled={gamePublisher?.audioEnabled}
        videoEnabled={gamePublisher?.videoEnabled}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
      />
      <ChattingList
        roomId={roomId}
        totalParticipants={participantList.length}
      />
    </div>
  );
};

export default GameViewer;
