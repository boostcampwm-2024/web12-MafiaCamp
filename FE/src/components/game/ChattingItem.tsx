interface ChattingItemProps {
  isSelf: boolean;
  nickname: string;
  content: string;
}

const ChattingItem = ({ isSelf, nickname, content }: ChattingItemProps) => {
  if (isSelf) {
    return (
      <div className='flex flex-col items-end text-sm text-white'>
        <div className='flex h-6 items-center justify-center rounded-t-lg bg-slate-600 px-3'>
          {nickname}
        </div>
        <div className='w-full whitespace-pre-wrap rounded-b-lg rounded-tl-lg bg-slate-600 p-3'>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-start text-sm text-slate-800'>
      <div className='flex h-6 items-center justify-center rounded-t-lg bg-white px-3'>
        {nickname}
      </div>
      <div className='w-full whitespace-pre-wrap rounded-b-lg rounded-tr-lg bg-white p-3'>
        {content}
      </div>
    </div>
  );
};

export default ChattingItem;
