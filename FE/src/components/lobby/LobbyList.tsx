'use client';

import 'react-toastify/dist/ReactToastify.css';
import LottieFile from '@/../public/lottie/no_data.json';
import Lottie from 'lottie-react';
import LobbyItem from './LobbyItem';
import { ToastContainer } from 'react-toastify';
import { useLobbyList } from '@/hooks/lobby/useLobbyList';

const LobbyList = () => {
  const { roomList, handleQuickStart, setTargetRoom } = useLobbyList();

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
            <LobbyItem
              key={room.roomId}
              room={room}
              setTargetRoom={() =>
                setTargetRoom({
                  roomId: room.roomId,
                  title: room.title,
                  capacity: room.capacity,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LobbyList;
