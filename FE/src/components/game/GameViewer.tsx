'use client';

import 'react-toastify/dist/ReactToastify.css';
import { useOpenVidu } from '@/hooks/useOpenVidu';
import Bottombar from './Bottombar';
import ChattingList from './chatting/ChattingList';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import { ROLE, Role } from '@/constants/role';
import { toast, ToastContainer } from 'react-toastify';
import { Situation, SITUATION_MESSAGE } from '@/constants/situation';
import VideoViewer from './video/VideoViewer';
import GameResultBoard from './GameResultBoard';
import { TOAST_OPTION } from '@/constants/toastOption';

interface GameViewerProps {
  roomId: string;
}

const GameViewer = ({ roomId }: GameViewerProps) => {
  // TODO: 하단 코드 리팩토링 필요.

  const { socket } = useSocketStore();
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
  } = useOpenVidu();

  const [situation, setSituation] = useState<Situation | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [invalidityCount, setInvalidityCount] = useState(0);

  const [gameResultVisible, setGameResultVisible] = useState(false);
  const [gameResult, setGameResult] = useState<'WIN' | 'LOSE'>('WIN');
  const [playerInfoList, setPlayerInfoList] = useState<
    {
      nickname: string;
      role: Role;
      status: 'ALIVE' | 'DEAD';
    }[]
  >([]);

  const notifyInfo = (message: string) =>
    toast.info(message, {
      ...TOAST_OPTION,
      toastId: message,
      autoClose: 5000,
    });

  useEffect(() => {
    // 방 입장
    socket?.emit('enter-room', { roomId });

    return () => {
      // 방 나가기
      socket?.emit('leave-room', { roomId });
    };
  }, [roomId, socket]);

  useEffect(() => {
    // 직업 확인
    socket?.once(
      'player-role',
      (data: { role: Role; another: [string, Role][] | null }) => {
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
        setSituation(data.situation);
        setTimeLeft(data.timeLeft);
      },
    );

    // 각 단계 시작
    socket?.on('countdown-start', (newSituation: Situation) => {
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
          if (situation === 'DISCUSSION') {
            notifyInfo(SITUATION_MESSAGE.PRIMARY_VOTE);
          } else if (situation === 'ARGUMENT') {
            notifyInfo(SITUATION_MESSAGE.FINAL_VOTE);
          }
          break;
        case 'MAFIA':
          if (gamePublisher.role === 'MAFIA') {
            setTargetsOfMafia();
          } else {
            initializeCandidates();
          }
          setTarget(null);
          notifyInfo(SITUATION_MESSAGE.MAFIA);
          break;
        case 'DOCTOR':
          if (gamePublisher.role === 'DOCTOR') {
            setAllParticipantsAsCandidates();
          } else {
            initializeCandidates();
          }
          setTarget(null);
          notifyInfo(SITUATION_MESSAGE.DOCTOR);
          break;
        case 'POLICE':
          if (gamePublisher.role === 'POLICE') {
            setTargetsOfPolice();
          } else {
            initializeCandidates();
          }
          setTarget(null);
          notifyInfo(SITUATION_MESSAGE.POLICE);
          break;
        default:
          break;
      }
    });

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
      initializeCandidates();
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
        setSituation(null);
        setTimeLeft(0);
        finishGame();
        setGameResult(data.result);
        setPlayerInfoList(data.playerInfo);
        setGameResultVisible(true);
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
    gamePublisher.nickname,
    gamePublisher.role,
    initializeCandidates,
    initializeVotes,
    setAllParticipantsAsCandidates,
    setTargetsOfMafia,
    setTargetsOfPolice,
    situation,
    socket,
  ]);

  return (
    <div className='absolute left-0 top-0 h-screen w-screen overflow-x-hidden'>
      <ToastContainer style={{ width: '40rem' }} />
      {gameResultVisible && (
        <GameResultBoard
          gamePublisherRole={
            playerInfoList.find(
              (playerInfo) => playerInfo.nickname === gamePublisher.nickname,
            )?.role ?? 'CITIZEN'
          }
          gameResult={gameResult}
          playerInfo={playerInfoList}
          closeBoard={() => setGameResultVisible(false)}
        />
      )}
      <VideoViewer
        roomId={roomId}
        gameStatus={gameStatus}
        gamePublisher={gamePublisher}
        gameSubscribers={gameSubscribers}
        situation={situation}
        target={target}
        invalidityCount={invalidityCount}
        setTarget={(nickname: string | null) => setTarget(nickname)}
      />
      <Bottombar
        roomId={roomId}
        gameStatus={gameStatus}
        gamePublisher={gamePublisher}
        totalParticipants={gameSubscribers.length + 1}
        situation={situation}
        timeLeft={timeLeft}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
      />
      <ChattingList
        roomId={roomId}
        isMafia={gamePublisher.role === 'MAFIA'}
        chatEnabled={gameStatus !== 'RUNNING' || gamePublisher.isAlive}
        totalParticipants={gameSubscribers.length + 1}
      />
    </div>
  );
};

export default GameViewer;
