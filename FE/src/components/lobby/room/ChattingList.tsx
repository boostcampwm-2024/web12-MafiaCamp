import PaperAirplainIcon from '@/components/common/icons/PaperAirplainIcon';
import ChattingItem from './ChattingItem';

const ChattingList = () => {
  return (
    <div className='absolute right-0 top-0 flex h-screen w-80 flex-col justify-between bg-slate-600/50'>
      <div className='flex h-full w-full flex-col gap-4 overflow-y-scroll px-4 py-6'>
        <ChattingItem
          isSelf={false}
          nickname='another1'
          content='안녕하세요.'
        />
        <ChattingItem
          isSelf={false}
          nickname='another2'
          content='안녕하세요. 만나서 반갑습니다.'
        />
        <ChattingItem
          isSelf={true}
          nickname='HyunJinNo'
          content='안녕하세요.'
        />
        <ChattingItem
          isSelf={false}
          nickname='another1'
          content='안녕하세요.'
        />
        <ChattingItem
          isSelf={false}
          nickname='another2'
          content='안녕하세요. 만나서 반갑습니다.'
        />
        <ChattingItem
          isSelf={true}
          nickname='HyunJinNo'
          content='안녕하세요.'
        />
        <ChattingItem
          isSelf={false}
          nickname='another1'
          content='안녕하세요.'
        />
        <ChattingItem
          isSelf={false}
          nickname='another2'
          content='안녕하세요. 만나서 반갑습니다.'
        />
        <ChattingItem
          isSelf={true}
          nickname='HyunJinNo'
          content='안녕하세요.'
        />
      </div>
      <div className='flex h-40 w-full flex-col items-center gap-4 bg-white p-4'>
        <textarea
          className='h-[4.75rem] w-full resize-none rounded-lg p-3 text-sm text-slate-800 outline-none ring-1 ring-slate-400'
          placeholder='내용을 입력해 주세요.'
        />
        <div className='flex w-full flex-row items-center justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-slate-800'>수신자</p>
            <button className='h-9 w-[3.75rem] rounded-2xl bg-slate-600 text-sm text-white hover:scale-105'>
              전체
            </button>
            <button className='h-9 w-20 rounded-2xl bg-slate-600 text-sm text-white hover:scale-105'>
              마피아
            </button>
          </div>
          <button className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 hover:scale-105'>
            <PaperAirplainIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChattingList;