import { useSocketStore } from '@/stores/socketStore';
import { useEffect } from 'react';

export const useConnectedUserList = () => {
  const { socket } = useSocketStore();

  useEffect(() => {
    socket?.on('online-user-list');
  }, []);
};
