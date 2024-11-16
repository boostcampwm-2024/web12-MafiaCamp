'use client';

import 'react-toastify/dist/ReactToastify.css';
import { useOpenVidu } from '@/hooks/useOpenVidu';
import Bottombar from './Bottombar';
import ChattingList from './ChattingList';
import VideoViewer from './VideoViewer';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import { Role } from '@/constants/role';
import { Participant } from '@/types/participant';
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
  } = useOpenVidu();

  const [participantList, setParticipantList] = useState<Participant[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [otherMafiaList, setOtherMafiaList] = useState<string[] | null>(null);
  const [situation, setSituation] = useState<Situation | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const notifyInfo = (message: string) =>
    toast.info(message, {
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
    // 게임 참가
    socket?.on('participants', (participants: string[]) => {
      setParticipantList(
        participants.map((participant) => ({
          nickname: participant,
          isAlive: true,
          votes: 0,
        })),
      );
    });

    // 카운트 다운
    socket?.on(
      'countdown',
      ({ situation, timeLeft }: { situation: Situation; timeLeft: number }) => {
        if (situation === 'INTERMISSION' && timeLeft === 5) {
          notifyInfo('잠시 후 게임이 시작됩니다.');
        }

        setSituation(situation);
        setTimeLeft(timeLeft);
      },
    );

    // 특정 단계 카운트 다운 종료
    socket?.on(
      'countdown-exit',
      ({ situation, timeLeft }: { situation: Situation; timeLeft: number }) => {
        switch (situation) {
          case 'INTERMISSION':
          case 'POLICE':
            notifyInfo(
              '낮이 되었습니다. 모든 플레이어들은 토론을 진행해 주세요.',
            );
            break;
          case 'DISCUSSION':
            notifyInfo(
              '투표를 시작하겠습니다. 마피아라고 생각되는 플레이어를 선택해 주세요.',
            );
            break;
          case 'ARGUMENT':
            notifyInfo(
              '최종 투표를 시작하겠습니다. 해당 플레이어를 죽일지, 아니면 살릴지 결정해 주세요.',
            );
            break;
          case 'VOTE':
            notifyInfo('투표가 종료되었습니다.');
            break;
          case 'MAFIA':
            notifyInfo(
              '의사는 마피아로부터 보호하고 싶은 플레이어 한 명을 선택해 주세요.',
            );
            break;
          case 'DOCTOR':
            notifyInfo(
              '경찰은 정체를 알고 싶은 플레이어 한 명을 선택해 주세요.',
            );
            break;
          default:
            throw new Error('Unknown Situation');
        }

        setSituation(situation);
        setTimeLeft(timeLeft);
      },
    );

    // 직업 확인
    socket?.on(
      'player-role',
      ({
        role,
        another,
      }: {
        role: Role | null;
        another: string[][] | null;
      }) => {
        setRole(role);
        setOtherMafiaList(another?.map((value) => value[0]) ?? []);
      },
    );

    // TODO: 투표 처음 시작시 투표대상 후보자 전송
    // socket?.on('send-vote-candidates', (data: { candidates: string[] }) => {});

    // 실시간 투표수 확인
    socket?.on('vote-current-state', (data: { [nickname: string]: number }) => {
      Object.keys(data).forEach((nickname) => {
        const participant = participantList.find(
          (participant) => participant.nickname === nickname,
        );
        if (participant) {
          participant.votes = data[nickname];
        }
      });
    });

    // 1차 투표 결과 확인
    socket?.on(
      'primary-vote-result',
      (data: { [nickname: string]: number }) => {
        // TODO
        console.log(data);
      },
    );

    // 최종 투표 결과
    socket?.on('final-vote-result', (data: { [nickname: string]: number }) => {
      // TODO
      console.log(data);
    });

    // 방 입장
    socket?.emit('enter-room', { roomId: roomId });

    return () => {
      socket?.off('player-role');
      socket?.off('countdown');
      socket?.off('participants');
      socket?.off('vote-current-state');
      socket?.off('primary-vote-result');
      socket?.off('final-vote-result');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='absolute left-0 top-0 h-screen w-screen overflow-x-hidden'>
      <ToastContainer />
      <VideoViewer
        isGameStarted={isGameStarted}
        participantList={participantList}
        playerRole={role}
        otherMafiaList={otherMafiaList}
        gamePublisher={gamePublisher}
        gameSubscribers={gameSubscribers}
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
