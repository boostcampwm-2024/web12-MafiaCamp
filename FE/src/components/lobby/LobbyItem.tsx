import UsersIcon from '../common/icons/UsersIcon';

const LobbyItem = () => {
  return (
    <div className='flex h-60 flex-col justify-between rounded-3xl border border-slate-200 bg-slate-600/50 p-6 duration-300 hover:bg-slate-400/50'>
      <div className='flex h-8 w-20 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-xs text-blue-800'>
        모집중
      </div>
      <div className='flex flex-col gap-3'>
        <h2 className='line-clamp-2 text-lg text-white'>
          마피아 게임을 좋아하는 사람이면 누구나 환영합니다. 다같이 마피아
          게임을 즐겨봅시다.
        </h2>
        <p className='text-sm text-slate-200'>HyunJinNo</p>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <UsersIcon />
            <p className='text-white'>
              1 / <span className='font-bold'>6</span>
            </p>
          </div>
          <button className='h-9 w-[7.5rem] rounded-2xl bg-white text-sm font-semibold text-slate-800 hover:scale-105'>
            참가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyItem;
