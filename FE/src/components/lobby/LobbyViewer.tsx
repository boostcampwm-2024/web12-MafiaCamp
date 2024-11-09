'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socketStore';

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, {
  transports: ['websocket', 'polling'],
});

const LobbyViewer = () => {
  const { setState } = useSocketStore();

  useEffect(() => {
    const nickname = new Date().getTime().toString(); // TODO: 닉네임 설정
    setState({ socket, nickname });
    socket.emit('set-nickname', { nickname });

    return () => {
      socket.off('set-nickname');
    };
  }, [setState]);

  return (
    <div className='flex flex-col items-center'>
      <LobbyBanner />
      <LobbyList />
    </div>
  );
};

export default LobbyViewer;
