'use client';

import { FormEvent } from 'react';
import CloseIcon from '../common/icons/CloseIcon';
import { useSocketStore } from '@/stores/socketStore';
import { useRouter } from 'next/navigation';

interface NicknameModalProps {
  setHasNickname: () => void;
}

const NicknameModal = ({ setHasNickname }: NicknameModalProps) => {
  const { nickname, setState } = useSocketStore();
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nickname === '') {
      alert('닉네임을 입력해 주세요.');
      return;
    }

    setHasNickname();
  };

  return (
    <form
      className='fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/25'
      onSubmit={handleSubmit}
    >
      <div className='flex w-[25rem] flex-col gap-8 rounded-2xl bg-white p-8'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-2xl text-slate-800'>닉네임 설정하기</h2>
          <CloseIcon
            className='scale-150 cursor-pointer rounded-lg fill-slate-600 hover:bg-slate-100'
            onClick={() => router.push('/')}
          />
        </div>
        <div className='flex flex-col gap-12 rounded-2xl bg-slate-100 p-6 text-slate-800'>
          <div className='flex flex-col gap-3'>
            <h3 className='text-lg'>닉네임</h3>
            <input
              className={`${nickname.length === 0 ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} rounded-2xl px-4 py-3.5 text-sm outline-none ring-1`}
              type='text'
              placeholder='닉네임을 입력해 주세요. (최대 20자)'
              maxLength={20}
              onChange={(e) => {
                setState({ nickname: e.target.value });
              }}
            />
          </div>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-200 text-sm font-semibold text-slate-800 drop-shadow-sm hover:scale-105'
            type='button'
            onClick={() => router.push('/')}
          >
            취소
          </button>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-400 bg-slate-600 text-white drop-shadow-sm hover:scale-105'
            type='submit'
          >
            등록하기
          </button>
        </div>
      </div>
    </form>
  );
};

export default NicknameModal;
