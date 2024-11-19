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
import { Situation, SITUATION_MESSAGE } from '@/constants/situation';

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
    changePublisherStatus,
    changeSubscriberStatus,
    initializeVotes,
    setAllParticipantsAsCandidates,
    eliminatePublisher,
  } = useOpenVidu();

  const [situation, setSituation] = useState<Situation | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [invalidityCount, setInvalidityCount] = useState(0);

  const notifyInfo = (message: string) =>
    toast.info(message, {
      toastId: message,
      position: 'top-center',
      autoClose: 5000,
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
    // 카운트 다운
    socket?.on(
      'countdown',
      (data: { situation: Situation; timeLeft: number }) => {
        if (data.situation === 'DISCUSSION' && data.timeLeft === 150) {
          notifyInfo(SITUATION_MESSAGE.DISCUSSION);
        }

        if (data.situation === 'ARGUMENT' && data.timeLeft === 90) {
          notifyInfo(SITUATION_MESSAGE.ARGUMENT);
        }

        if (data.situation === 'VOTE' && data.timeLeft === 15) {
          if (situation === 'DISCUSSION') {
            notifyInfo(SITUATION_MESSAGE.PRIMARY_VOTE);
          } else if (situation === 'ARGUMENT') {
            notifyInfo(SITUATION_MESSAGE.FINAL_VOTE);
          }
        }

        if (data.situation === 'MAFIA' && data.timeLeft === 30) {
          setTarget(null);
          setAllParticipantsAsCandidates();
          notifyInfo(SITUATION_MESSAGE.MAFIA);
        }

        if (data.situation === 'DOCTOR' && data.timeLeft === 20) {
          setTarget(null);
          setAllParticipantsAsCandidates();
          notifyInfo(SITUATION_MESSAGE.DOCTOR);
        }

        if (data.situation === 'POLICE' && data.timeLeft === 20) {
          setTarget(null);
          setAllParticipantsAsCandidates();
          notifyInfo(SITUATION_MESSAGE.POLICE);
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
        changePublisherStatus({ role: data.role });
        data.another?.forEach((value) => {
          changeSubscriberStatus(value[0], { role: value[1] });
        });

        notifyInfo(SITUATION_MESSAGE.INTERMISSION);
      },
    );

    // 투표 시작 시 투표 대상 후보자 설정
    socket?.on('send-vote-candidates', (candidates: string[]) => {
      initializeVotes();
      setTarget(null);
      setInvalidityCount(0);

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
          setInvalidityCount(votes);
        } else if (nickname === gamePublisher.nickname) {
          changePublisherStatus({ votes });
        } else {
          changeSubscriberStatus(nickname, { votes });
        }
      }
    });

    // 1차 투표 결과 확인
    socket?.on('primary-vote-result', (candidates: string[]) => {
      initializeVotes();
      setTarget(null);
      setInvalidityCount(0);

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
          notifyInfo('처형이 보류되었습니다.');
          return;
        }

        if (data.player === gamePublisher.nickname) {
          eliminatePublisher();
        }

        notifyInfo(`${ROLE[data.job]} ${data.player} 님이 사망하였습니다.`);
      },
    );

    // 실시간 마피아 타겟 확인
    if (gamePublisher.role === 'MAFIA') {
      socket?.on('mafia-current-target', (target: string) => {
        setTarget(target);
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

    return () => {
      socket?.off('countdown');
      socket?.off('countdown-exit');
      socket?.off('player-role');
      socket?.off('vote-current-state');
      socket?.off('primary-vote-result');
      socket?.off('vote-kill-user');
      socket?.off('police-investigation-result');
    };
  }, [
    changePublisherStatus,
    changeSubscriberStatus,
    eliminatePublisher,
    gamePublisher.nickname,
    gamePublisher.role,
    initializeVotes,
    setAllParticipantsAsCandidates,
    situation,
    socket,
  ]);

  return (
    <div className='absolute left-0 top-0 h-screen w-screen overflow-x-hidden'>
      <ToastContainer style={{ width: '40rem' }} />
      <VideoViewer
        roomId={roomId}
        isGameStarted={isGameStarted}
        situation={situation}
        gamePublisher={gamePublisher}
        gameSubscribers={gameSubscribers}
        target={target}
        invalidityCount={invalidityCount}
        setTarget={(nickname: string | null) => setTarget(nickname)}
      />
      <Bottombar
        roomId={roomId}
        totalParticipants={gameSubscribers.length + 1}
        situation={situation}
        timeLeft={timeLeft}
        audioEnabled={
          gamePublisher.participant ? gamePublisher.audioEnabled : null
        }
        videoEnabled={
          gamePublisher.participant ? gamePublisher.videoEnabled : null
        }
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
      />
      <ChattingList
        roomId={roomId}
        totalParticipants={gameSubscribers.length + 1}
      />
    </div>
  );
};

export default GameViewer;
