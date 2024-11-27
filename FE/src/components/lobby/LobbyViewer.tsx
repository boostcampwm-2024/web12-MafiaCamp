'use client';

import { io } from 'socket.io-client';
import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/stores/socketStore';
import NicknameModal from './NicknameModal';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import ConnectedUserList from './ConnectedUserList';

const LobbyViewer = () => {
  const { userId, nickname } = useAuthStore();
  const { setSocketState } = useSocketStore();
  const [hasNickname, setHasNickname] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasNickname) {
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
      socket.emit('set-nickname', { nickname });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNickname, router, setSocketState]);

  return (
    <div className='flex flex-col items-center'>
      {!hasNickname && (
        <NicknameModal setHasNickname={() => setHasNickname(true)} />
      )}
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
