import LobbyItem from './LobbyItem';

const LobbyList = () => {
  return (
    <div className='flex w-full flex-col gap-8 pb-20 pt-24'>
      <div className='flex flex-row items-center justify-between border-b border-b-white pb-4'>
        <h2 className='text-5xl text-white'>로비</h2>
        <button className='h-12 w-36 rounded-2xl bg-white text-sm font-bold text-slate-800 hover:scale-105'>
          QUICK START
        </button>
      </div>
      <div className='grid grid-cols-3 gap-3'>
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
