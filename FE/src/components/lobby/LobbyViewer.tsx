'use client';

import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import ConnectedUserList from './ConnectedUserList';
import { useSocketStore } from '@/stores/socketStore';
import { usePermissionManager } from '@/hooks/usePermissionManager';

const LobbyViewer = () => {
  const { socket } = useSocketStore();
  const { permissionGranted } = usePermissionManager();

  return (
    <div className='flex flex-col items-center'>
      {!permissionGranted && (
        <div className='fixed left-0 top-0 z-50 h-full w-full' />
      )}
      {socket && (
        <ConnectedUserList
          userList={[
            {
              nickname:
                '일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십',
              isInLobby: true,
            },
            { nickname: '구현_예정', isInLobby: true },
            { nickname: '구현예정', isInLobby: false },
            { nickname: '구현할_예정', isInLobby: true },
            { nickname: '구현할예정입니다.', isInLobby: true },
            { nickname: '유저_실시간_접속_상태', isInLobby: true },
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
