'use client';

import { useOpenVidu } from '@/hooks/useOpenVidu';
import Bottombar from './Bottombar';
import ChattingList from './ChattingList';
import VideoViewer from './VideoViewer';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';

interface GameViewerProps {
  roomId: string;
}

const GameViewer = ({ roomId }: GameViewerProps) => {
  const { socket } = useSocketStore();
  const {
    isGameStarted,
    gamePublisher,
    gameSubscribers,
    toggleAudio,
    toggleVideo,
  } = useOpenVidu();

  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    socket?.on('participants', (participants: string[]) => {
      setParticipants(participants);
    });
    socket?.emit('enter-room', { roomId: roomId });

    return () => {
      socket?.off('participants');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='absolute left-0 top-0 h-screen w-screen overflow-x-hidden'>
      <VideoViewer
        isGameStarted={isGameStarted}
        participants={participants}
        gamePublisher={gamePublisher}
        gameSubscribers={gameSubscribers}
      />
      <Bottombar
        roomId={roomId}
        audioEnabled={gamePublisher?.audioEnabled}
        videoEnabled={gamePublisher?.videoEnabled}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
      />
      <ChattingList roomId={roomId} totalParticipants={participants.length} />
    </div>
  );
};

export default GameViewer;
