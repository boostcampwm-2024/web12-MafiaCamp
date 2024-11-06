'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socketStore';

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);

const LobbyViewer = () => {
  const { connect } = useSocketStore();

  useEffect(() => {
    connect(socket);

    socket.emit('set-nickname', { nickname: new Date().getTime().toString() }); // TODO: 닉네임 설정
    socket.on('chat', (data: { from: string; to: string; message: string }) => {
      alert(`${data.from} 유저로부터 온 메시지입니다: ${data.message}`);
    });

    return () => {
      socket.off('set-nickname');
      socket.off('chat');
    };
  }, [connect]);

  return (
    <div className='flex flex-col items-center'>
      <LobbyBanner />
      <LobbyList />
    </div>
  );
};

export default LobbyViewer;
