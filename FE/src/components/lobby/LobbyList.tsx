'use client';

import 'react-toastify/dist/ReactToastify.css';
import LottieFile from '@/../public/lottie/no_data.json';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import LobbyItem from './LobbyItem';
import { Room } from '@/types/room';
import { useSocketStore } from '@/stores/socketStore';
import { toast, ToastContainer } from 'react-toastify';
import { TOAST_OPTION } from '@/constants/toastOption';
import { useRouter } from 'next/navigation';

const LobbyList = () => {
  const { socket } = useSocketStore();
  const [roomList, setRoomList] = useState<Room[]>([]);
  const router = useRouter();

  const notifyError = (message: string) => {
    toast.error(message, TOAST_OPTION);
  };

  const handleQuickStart = async () => {
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
      notifyError('방이 존재하지 않습니다.');
      return;
    }

    router.push(
      `/game/${result.roomId}?roomName=${result.title}&capacity=${result.capacity}`,
    );
  };

  useEffect(() => {
    socket?.on('room-list', (rooms: Room[]) => setRoomList(rooms));
    socket?.emit('room-list');

    return () => {
      socket?.off('room-list');
    };
  }, [socket]);

  return (
    <div className='flex w-full flex-col gap-8 pb-20 pt-24'>
      <ToastContainer style={{ width: '40rem' }} />
      <div className='flex flex-row items-center justify-between border-b border-b-white pb-4'>
        <h2 className='text-5xl text-white'>로비</h2>
        <button
          className={[
            `${roomList.length === 0 ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}`,
            'flex h-12 w-36 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-800',
          ].join(' ')}
          onClick={handleQuickStart}
          disabled={roomList.length === 0}
        >
          QUICK START
        </button>
      </div>
      {roomList.length === 0 ? (
        <div className='flex flex-col items-center pt-10'>
          <Lottie animationData={LottieFile} className='w-80' />
          <p className='text-4xl text-white'>방을 생성해 보세요!</p>
        </div>
      ) : (
        <div className='grid grid-cols-3 gap-3 max-[1080px]:grid-cols-2 max-[768px]:grid-cols-1'>
          {roomList.map((room) => (
            <LobbyItem key={room.roomId} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LobbyList;
