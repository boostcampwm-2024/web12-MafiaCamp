import { useConnectedUserListStore } from '@/stores/connectedUserListStore';
import { useSocketStore } from '@/stores/socketStore';
import { useEffect } from 'react';

export const useConnectedUserList = () => {
  const { setConnectedUserList, updateConnectedUserList, deleteUser } =
    useConnectedUserListStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    socket?.on(
      'online-user-list',
      (data: {
        [userId: number]: { nickname: string; isInLobby: boolean };
      }) => {
        setConnectedUserList(data);
      },
    );

    socket?.on(
      'upsert-online-user',
      (data: { userId: string; nickname: string; isInLobby: boolean }) => {
        updateConnectedUserList(data);
      },
    );

    socket?.on('exit-online-user', (data: { userId: string }) => {
      deleteUser(data.userId);
    });
  }, [deleteUser, setConnectedUserList, socket, updateConnectedUserList]);
};
