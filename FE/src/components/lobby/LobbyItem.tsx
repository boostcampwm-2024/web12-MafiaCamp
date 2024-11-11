'use client';

import { Room } from '@/types/room';
import UsersIcon from '../common/icons/UsersIcon';
import { ROOM_STATUS } from '@/constants/roomStatus';
import { useSocketStore } from '@/stores/socketStore';
import { useRouter } from 'next/navigation';

interface LobbyItemProps {
  room: Room;
}

const LobbyItem = ({ room }: LobbyItemProps) => {
  const { socket } = useSocketStore();
  const router = useRouter();

  const handleEnterRoom = () => {
    socket?.emit('enter-room', { roomId: room.roomId });
    router.push(`/game/${room.roomId}`);
  };

  return (
    <div className='flex h-60 flex-col justify-between rounded-3xl border border-slate-200 bg-slate-600/50 p-6 duration-300 hover:bg-slate-400/50'>
      <div className='flex h-8 w-20 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-xs text-blue-800'>
        {ROOM_STATUS[room.status]}
      </div>
      <div className='flex flex-col gap-3'>
        <h2 className='line-clamp-2 text-lg text-white'>{room.title}</h2>
        <p className='text-sm text-slate-200'>{'TODO: 닉네임 가져오기'}</p>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <UsersIcon />
            <p className='text-white'>
              {room.participants} /{' '}
              <span className='font-bold'>{room.capacity}</span>
            </p>
          </div>
          <button
            className={`${room.status === 'READY' ? 'bg-white text-slate-800 hover:scale-105' : 'cursor-not-allowed bg-slate-800 text-slate-400'} h-9 w-[7.5rem] rounded-2xl text-sm font-semibold`}
            disabled={room.status !== 'READY'}
            onClick={() => handleEnterRoom()}
          >
            참가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyItem;
