'use client';

import LobbyBanner from './LobbyBanner';
import LobbyList from './LobbyList';
import ConnectedUserList from './ConnectedUserList';
import { useSocketStore } from '@/stores/socketStore';
import { usePermissionManager } from '@/hooks/lobby/usePermissionManager';

const LobbyViewer = () => {
  const { socket } = useSocketStore();
  const { permissionGranted } = usePermissionManager();

  return (
    <div className='flex flex-col items-center'>
      {!permissionGranted && (
        <div className='fixed left-0 top-0 z-50 h-full w-full' />
      )}
      {socket && <ConnectedUserList />}
      <LobbyBanner />
      <LobbyList />
    </div>
  );
};

export default LobbyViewer;
