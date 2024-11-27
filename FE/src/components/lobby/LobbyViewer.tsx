'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import ConnectedUserList from './ConnectedUserList';

const LobbyViewer = () => {
  const { userId } = useAuthStore();
  const { setSocketState } = useSocketStore();
  const router = useRouter();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`, {
      transports: ['websocket', 'polling'], // use WebSocket first, if available
    });

    socket.on('connect_error', (error) => {
      console.error(`연결 실패: ${error}`);
      alert('서버와의 연결에 실패하였습니다. 잠시 후에 다시 시도해 주세요.');
      socket.disconnect();
      setSocketState({ socket: null });
      router.replace('/');
    });

    setSocketState({ socket });
  }, [router, setSocketState]);

  return (
    <div className='flex flex-col items-center'>
      {userId !== '' && (
        <ConnectedUserList
          userList={[
            {
              nickname:
                '일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십',
              isInLobby: true,
            },
            { nickname: 'AB', isInLobby: true },
            { nickname: 'ABCD', isInLobby: false },
            { nickname: 'ABCDE', isInLobby: true },
            { nickname: 'B', isInLobby: true },
            { nickname: 'BBBB', isInLobby: true },
            { nickname: '닉네임_TEST', isInLobby: false },
            { nickname: '테스트', isInLobby: true },
            { nickname: '마피아', isInLobby: true },
            { nickname: '유저', isInLobby: true },
            { nickname: 'HyunJinNo', isInLobby: false },
            { nickname: 'Mafia', isInLobby: true },
            { nickname: 'A', isInLobby: true },
            { nickname: 'AB', isInLobby: true },
            { nickname: 'ABCD', isInLobby: false },
            { nickname: 'ABCDE', isInLobby: true },
            { nickname: 'B', isInLobby: true },
            { nickname: 'BBBB', isInLobby: true },
            { nickname: '닉네임_TEST', isInLobby: false },
            { nickname: '테스트', isInLobby: true },
            { nickname: '마피아', isInLobby: true },
            { nickname: '유저', isInLobby: true },
            { nickname: 'HyunJinNo', isInLobby: false },
            { nickname: 'Mafia', isInLobby: true },
          ]}
        />
      )}
      <LobbyBanner />
      <LobbyList />
    </div>
  );
};

export default LobbyViewer;
