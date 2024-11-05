import Link from 'next/link';
import LobbyItem from './LobbyItem';

const LobbyList = () => {
  return (
    <div className='flex w-full flex-col gap-8 pb-20 pt-24'>
      <div className='flex flex-row items-center justify-between border-b border-b-white pb-4'>
        <h2 className='text-5xl text-white'>로비</h2>
        <Link
          className='flex h-12 w-36 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-800 hover:scale-105'
          href='/game/1'
        >
          QUICK START
        </Link>
      </div>
      <div className='grid grid-cols-3 gap-3 max-[1080px]:grid-cols-2 max-[768px]:grid-cols-1'>
        <LobbyItem />
        <LobbyItem />
        <LobbyItem />
        <LobbyItem />
        <LobbyItem />
        <LobbyItem />
      </div>
    </div>
  );
};

export default LobbyList;
