import { memo } from 'react';

interface ChattingItemProps {
  isSelf: boolean;
  isMafiaOnly: boolean;
  nickname: string;
  content: string;
}

const ChattingItem = ({
  isSelf,
  isMafiaOnly,
  nickname,
  content,
}: ChattingItemProps) => {
  if (isSelf) {
    return (
      <div className='flex flex-col items-end text-sm text-white'>
        <div className='flex max-w-full flex-row items-center gap-2'>
          <p className='text-nowrap text-xs'>
            {new Date().toLocaleTimeString('ko', {
              hour12: true,
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
          <p
            className={`${isMafiaOnly ? 'text-sky-400' : 'text-emerald-400'} text-nowrap text-xs`}
          >
            {isMafiaOnly ? '마피아' : '전체'}
          </p>
          <div className='truncate rounded-t-lg bg-slate-600 px-3 py-0.5'>
            {nickname}
          </div>
        </div>
        <div className='w-full whitespace-pre-wrap rounded-b-lg rounded-tl-lg bg-slate-600 p-3 text-end'>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start text-sm text-slate-800'>
      <div className='flex w-full flex-row items-center gap-2'>
        <div className='truncate rounded-t-lg bg-white px-3 py-0.5'>
          {nickname}
        </div>
        <p
          className={`${isMafiaOnly ? 'text-sky-400' : 'text-emerald-400'} text-nowrap text-xs`}
        >
          {isMafiaOnly ? '마피아' : '전체'}
        </p>
        <p className='text-nowrap text-xs text-white'>
          {new Date().toLocaleTimeString('ko', {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
          })}
        </p>
      </div>
      <div className='w-full whitespace-pre-wrap rounded-b-lg rounded-tr-lg bg-white p-3'>
        {content}
      </div>
    </div>
  );
};

export default memo(ChattingItem);
