'use client';

import { useSocketStore } from '@/stores/socketStore';
import CloseIcon from '../icons/CloseIcon';
import { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NicknameChangeFormSchema } from '@/libs/zod/nicknameChangeFormSchema';

interface NicknameModalProps {
  closeModal: () => void;
}

const NicknameModal = ({ closeModal }: NicknameModalProps) => {
  const { nickname } = useSocketStore();

  const methods = useForm<{ newNickname: string }>({
    resolver: zodResolver(NicknameChangeFormSchema),
    defaultValues: {
      newNickname: nickname,
    },
    mode: 'onChange',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await methods.trigger();
    if (!methods.formState.isValid) {
      return;
    }

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/nickname`,
    // );
  };

  return (
    <form
      className='fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/25'
      onSubmit={handleSubmit}
    >
      <div className='flex w-[25rem] flex-col gap-8 rounded-2xl bg-white p-8'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-2xl text-slate-800'>닉네임 변경하기</h2>
          <CloseIcon
            className='scale-150 cursor-pointer rounded-lg fill-slate-600 hover:bg-slate-100'
            onClick={() => closeModal()}
          />
        </div>
        <div className='flex flex-col gap-12 rounded-2xl bg-slate-100 p-6 text-slate-800'>
          <div className='relative flex flex-col gap-3'>
            <label className='text-lg' htmlFor='newNickname'>
              닉네임
            </label>
            <input
              className={`${methods.formState.errors.newNickname ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} rounded-2xl px-4 py-3.5 text-sm outline-none ring-1`}
              id='newNickname'
              type='text'
              placeholder='닉네임을 입력해 주세요. (최대 30자)'
              {...methods.register('newNickname')}
              autoComplete='off'
              maxLength={30}
              onChange={(e) => {
                methods.setValue('newNickname', e.target.value);
                methods.trigger('newNickname');
              }}
            />
            {methods.formState.errors.newNickname && (
              <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                {methods.formState.errors.newNickname.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-200 text-sm font-semibold text-slate-800 drop-shadow-sm hover:scale-105'
            type='button'
            onClick={() => closeModal()}
          >
            취소
          </button>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-400 bg-slate-600 text-white drop-shadow-sm hover:scale-105'
            type='submit'
          >
            변경하기
          </button>
        </div>
      </div>
    </form>
  );
};

export default NicknameModal;
