'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import NicknameModal from './NicknameModal';
import { useRouter } from 'next/navigation';

const LobbyViewer = () => {
  const { nickname, setState } = useSocketStore();
  const [hasNickname, setHasNickname] = useState(nickname !== '');
  const router = useRouter();

  useEffect(() => {
    if (hasNickname) {
      const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, {
        transports: ['websocket', 'polling'], // use WebSocket first, if available
      });

      socket.on('connect_error', (error) => {
        console.error(`연결 실패: ${error}`);
        alert('서버와의 연결에 실패하였습니다. 잠시 후에 다시 시도해 주세요.');
        router.replace('/');
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
