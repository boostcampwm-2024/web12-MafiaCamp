'use client';

import 'react-toastify/dist/ReactToastify.css';
import Bottombar from './Bottombar';
import ChattingList from './chatting/ChattingList';
import { ToastContainer } from 'react-toastify';
import VideoViewer from './video/VideoViewer';
import GameResultBoard from './GameResultBoard';
import useGameStatus from '@/hooks/useGameStatus';

interface GameViewerProps {
  roomId: string;
}

const GameViewer = ({ roomId }: GameViewerProps) => {
  const {
    participantList,
    gamePublisher,
    gameSubscribers,
    gameStatus,
    situation,
    timeLeft,
    target,
    invalidityCount,
    gameResult,
    gameResultVisible,
    playerInfoList,
    toggleAudio,
    toggleVideo,
    setTarget,
    closeGameResultBoard,
  } = useGameStatus(roomId);

  if (!participantList) {
    return null;
  }

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
          closeBoard={closeGameResultBoard}
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
        setTarget={setTarget}
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
