'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import NicknameModal from './NicknameModal';

const LobbyViewer = () => {
  const { nickname, setState } = useSocketStore();
  const [hasNickname, setHasNickname] = useState(nickname !== '');

  useEffect(() => {
    if (hasNickname) {
      const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, {
        transports: ['websocket', 'polling'],
      });

      setState({ socket });
      socket.emit('set-nickname', { nickname });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNickname]);

  return (
    <div className='flex flex-col items-center'>
      {!hasNickname && (
        <NicknameModal setHasNickname={() => setHasNickname(true)} />
      )}
      <LobbyBanner />
      <LobbyList />
    </div>
  );
};

export default LobbyViewer;
