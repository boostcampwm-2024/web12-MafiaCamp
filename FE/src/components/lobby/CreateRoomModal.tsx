'use client';

import React, { FormEvent, useEffect } from 'react';
import CloseIcon from '../common/icons/CloseIcon';
import { useForm } from 'react-hook-form';
import { RoomCreateFormSchema } from '@/libs/zod/roomCreateFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSocketStore } from '@/stores/socketStore';

interface CreateRoomModalProps {
  close: () => void;
}

const CreateRoomModal = ({ close }: CreateRoomModalProps) => {
  const { socket } = useSocketStore();
  const methods = useForm<{ title: string; capacity: string }>({
    resolver: zodResolver(RoomCreateFormSchema),
    defaultValues: {
      title: '',
      capacity: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await methods.trigger();
    if (!methods.formState.isValid) {
      methods.trigger();
      return;
    }

    const { title, capacity } = methods.getValues();
    socket?.emit('create-room', { title, capacity: Number(capacity) });
  };

  useEffect(() => {
    socket?.on('create-room', (response: { success: boolean }) => {
      if (response.success) {
        alert('TODO: 방 바로 이동하기');
        close();
      }
    });

    return () => {
      socket?.off('create-room');
    };
  }, [close, socket]);

  return (
    <form
      className='fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/25'
      onSubmit={handleSubmit}
    >
      <div className='flex w-[25rem] flex-col gap-8 rounded-2xl bg-white p-8'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-2xl text-slate-800'>방 만들기</h2>
          <CloseIcon
            className='scale-150 cursor-pointer rounded-lg fill-slate-600 hover:bg-slate-100'
            onClick={() => close()}
          />
        </div>
        <div className='flex flex-col gap-12 rounded-2xl bg-slate-100 p-6 text-slate-800'>
          <div className='relative flex flex-col gap-3'>
            <label className='text-lg' htmlFor='title'>
              방 이름
            </label>
            <input
              className={`${methods.formState.errors.title ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} rounded-2xl px-4 py-3.5 text-sm outline-none ring-1`}
              id='title'
              type='text'
              placeholder='방 이름을 입력해 주세요. (최대 30자)'
              {...methods.register('title')}
              maxLength={30}
              autoComplete='off'
              onChange={(e) => {
                methods.setValue('title', e.target.value);
                methods.trigger('title');
              }}
            />
            {methods.formState.errors.title && (
              <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                {methods.formState.errors.title.message as string}
              </p>
            )}
          </div>
          <div className='relative flex flex-col gap-3'>
            <label className='text-lg' htmlFor='capacity'>
              인원 수
            </label>
            <select
              className={`${methods.formState.errors.capacity ? 'ring-red-500' : 'ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'} rounded-2xl px-4 py-3.5 text-sm outline-none ring-1`}
              id='capacity'
              {...methods.register('capacity')}
            >
              <option value='' disabled={true}>
                인원 수를 선택해 주세요.
              </option>
              <option value='6'>6명</option>
              <option value='7'>7명</option>
              <option value='8'>8명</option>
            </select>
            {methods.formState.errors.capacity && (
              <p className='absolute -bottom-6 left-4 text-xs text-red-500'>
                {methods.formState.errors.capacity.message as string}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-200 text-sm font-semibold text-slate-800 drop-shadow-sm hover:scale-105'
            type='button'
            onClick={() => close()}
          >
            취소
          </button>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-400 bg-slate-600 text-white drop-shadow-sm hover:scale-105'
            type='submit'
          >
            방 만들기
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateRoomModal;
