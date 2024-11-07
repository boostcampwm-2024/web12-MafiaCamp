'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect } from 'react';

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);

const LobbyViewer = () => {
  useEffect(() => {
    socket.emit('set-nickname', { nickname: new Date().getTime().toString() }); // TODO: 닉네임 설정

    socket.on('chat', (data: { from: string; to: string; message: string }) => {
      alert(`${data.from} 유저로부터 온 메시지입니다: ${data.message}`);
    });

    return () => {
      socket.off('set-nickname');
      socket.off('chat');
    };
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <LobbyBanner socket={socket} />
      <LobbyList socket={socket} />
    </div>
  );
};

export default LobbyViewer;
