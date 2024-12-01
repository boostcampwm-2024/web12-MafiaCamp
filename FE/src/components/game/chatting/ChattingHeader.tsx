'use client';

import CloseIcon from '@/components/common/icons/CloseIcon';
import UsersIcon from '@/components/common/icons/UsersIcon';
import { useSearchParams } from 'next/navigation';

interface ChattingHeaderProps {
  totalParticipants: number;
  closeSidebar: () => void;
}

const ChattingHeader = ({
  totalParticipants,
  closeSidebar,
}: ChattingHeaderProps) => {
  const searchParams = useSearchParams();
  const roomName = searchParams.get('roomName');
  const capacity = searchParams.get('capacity');

  return (
    <div className='flex h-16 w-full flex-row items-center justify-between gap-3 bg-slate-600 p-4 text-white'>
      <h2 className='truncate text-nowrap text-sm'>{roomName}</h2>
      <div className='flex flex-row items-center gap-3'>
        <div className='flex flex-row items-center gap-2 text-sm'>
          <UsersIcon />
          <p className='text-nowrap text-white'>
            {totalParticipants} / <span className='font-bold'>{capacity}</span>
          </p>
        </div>
        <CloseIcon
          className='cursor-pointer rounded-lg fill-white hover:bg-slate-400'
          onClick={() => closeSidebar()}
        />
      </div>
    </div>
  );
};

export default ChattingHeader;
