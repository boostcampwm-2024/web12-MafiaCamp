'use client';

import PaperAirplainIcon from '@/components/common/icons/PaperAirplainIcon';
import { useChattingForm } from '@/hooks/game/chatting/useChattingForm';

interface ChattingFormProps {
  roomId: string;
  isMafia: boolean;
}

const ChattingForm = ({ roomId, isMafia }: ChattingFormProps) => {
  const { message, isMafiaOnly, setMessage, handleSubmit, setIsMafiaOnly } =
    useChattingForm(roomId);

  return (
    <form
      className='flex h-40 w-full flex-col items-center gap-4 bg-white p-4'
      onSubmit={handleSubmit}
    >
      <textarea
        className='h-[4.75rem] w-full resize-none rounded-lg p-3 text-sm text-slate-800 outline-none ring-1 ring-slate-400'
        value={message}
        autoComplete='off'
        placeholder='내용을 입력해 주세요.'
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <div className='flex w-full flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-2'>
          <p className='text-slate-800'>수신자</p>
          <button
            className={`${isMafiaOnly && 'bg-transparent/10 hover:bg-transparent/50'} h-9 w-[3.75rem] rounded-2xl bg-slate-600 text-sm text-white`}
            type='button'
            onClick={() => setIsMafiaOnly(false)}
          >
            전체
          </button>
          {isMafia && (
            <button
              className={`${!isMafiaOnly && 'bg-transparent/10 hover:bg-transparent/50'} h-9 w-20 rounded-2xl bg-slate-600 text-sm text-white`}
              type='button'
              onClick={() => setIsMafiaOnly(true)}
            >
              마피아
            </button>
          )}
        </div>
        <button
          className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-600 hover:scale-105'
          type='submit'
        >
          <PaperAirplainIcon />
        </button>
      </div>
    </form>
  );
};

export default ChattingForm;
