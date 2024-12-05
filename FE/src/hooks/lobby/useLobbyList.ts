'use client';

import { TOAST_OPTION } from '@/constants/toastOption';
import { useParticipantListStore } from '@/stores/participantListStore';
import { useSocketStore } from '@/stores/socketStore';
import { Room } from '@/types/room';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useThrottle } from '../utils/useThrottle';

export const useLobbyList = () => {
  const { setParticipantList } = useParticipantListStore();
  const { socket } = useSocketStore();
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [targetRoom, setTargetRoom] = useState<{
    roomId: string;
    title: string;
    capacity: number;
  } | null>(null);
  const router = useRouter();

  const notifyError = (message: string) => {
    toast.error(message, TOAST_OPTION);
  };

  const handleQuickStart = useThrottle(async () => {
    const response = await fetch('/api/rooms/vacant', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response) {
      notifyError('오류가 발생하였습니다. 잠시 후에 다시 시도해 주세요.');
      return;
    }

    const result: {
      roomId: string | null;
      capacity: number | null;
      title: string | null;
    } = await response.json();

    if (result.roomId === null) {
      notifyError('입장할 수 있는 방이 존재하지 않습니다.');
      return;
    }

    setTargetRoom({
      roomId: result.roomId!,
      title: result.title!,
      capacity: result.capacity!,
    });
    socket?.emit('enter-room', { roomId: result.roomId });
  }, 2000);

  useEffect(() => {
    socket?.on('room-list', (rooms: Room[]) => setRoomList(rooms));
    socket?.on('error', () => {
      setTargetRoom(null);
      notifyError('방 입장에 실패하였습니다.');
    });
    socket?.once(
      'participants',
      (data: { nickname: string; isOwner: boolean }[]) => {
        if (targetRoom) {
          setParticipantList(data);
          router.push(
            `/game/${targetRoom.roomId}?roomName=${targetRoom.title}&capacity=${targetRoom.capacity}`,
          );
        }
      },
    );
    socket?.emit('room-list');

    return () => {
      socket?.off('room-list');
      socket?.off('error');
      socket?.off('participants');
    };
  }, [router, setParticipantList, socket, targetRoom]);

  return { roomList, handleQuickStart, setTargetRoom };
};
