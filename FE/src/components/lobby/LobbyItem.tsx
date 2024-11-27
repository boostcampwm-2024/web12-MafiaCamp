import { Room } from '@/types/room';
import UsersIcon from '../common/icons/UsersIcon';
import { ROOM_STATUS } from '@/constants/roomStatus';
import Link from 'next/link';

interface LobbyItemProps {
  room: Room;
}

const LobbyItem = ({ room }: LobbyItemProps) => {
  return (
    <div
      className={`${(room.participants === room.capacity || room.status === 'RUNNING') && 'opacity-50'} flex h-60 flex-col justify-between rounded-3xl border border-slate-200 bg-slate-600/50 p-6 duration-300 hover:bg-slate-400/50`}
    >
      <div className='flex h-8 w-20 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-xs text-blue-800'>
        {ROOM_STATUS[room.status]}
      </div>
      <div className='flex flex-col gap-3'>
        <h2 className='line-clamp-2 text-lg text-white'>{room.title}</h2>
        <p className='text-sm text-slate-200'>{room.owner}</p>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <UsersIcon />
            <p className='text-white'>
              {room.participants} /{' '}
              <span className='font-bold'>{room.capacity}</span>
            </p>
          </div>
          {room.participants === room.capacity || room.status === 'RUNNING' ? (
            <div className='flex h-9 w-[7.5rem] cursor-not-allowed items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-800'>
              참가하기
            </div>
          ) : (
            <Link
              className='flex h-9 w-[7.5rem] items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-800 hover:scale-105'
              href={`/game/${room.roomId}?roomName=${room.title}&capacity=${room.capacity}`}
            >
              참가하기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LobbyItem;
