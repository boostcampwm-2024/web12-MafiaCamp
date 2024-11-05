import React from 'react';
import CloseIcon from '../common/icons/CloseIcon';

interface CreateRoomModalProps {
  close: () => void;
}

const CreateRoomModal = ({ close }: CreateRoomModalProps) => {
  return (
    <div className='fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-black/25'>
      <div className='flex w-[25rem] flex-col gap-8 rounded-2xl bg-white p-8'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-2xl text-slate-800'>방 만들기</h2>
          <CloseIcon
            className='scale-150 cursor-pointer rounded-lg fill-slate-600 hover:bg-slate-100'
            onClick={() => close()}
          />
        </div>
        <div className='flex flex-col gap-6 bg-slate-100 p-6 text-slate-800'>
          <div className='flex flex-col gap-3'>
            <h3 className='text-lg'>방 이름</h3>
            <input
              className='rounded-2xl px-4 py-3.5 text-sm outline-none ring-1 ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'
              type='text'
              placeholder='방 이름을 입력해 주세요.'
            />
          </div>
          <div className='flex flex-col gap-3'>
            <h3 className='text-lg'>인원 수</h3>
            <select
              className='rounded-2xl px-4 py-3.5 text-sm outline-none ring-1 ring-slate-200 hover:ring-slate-400 focus:ring-slate-400'
              id='capacity'
              name='capacity'
              defaultValue={0}
            >
              <option value={0} disabled={true}>
                인원 수를 선택해 주세요.
              </option>
              <option value={6}>6명</option>
              <option value={7}>7명</option>
              <option value={8}>8명</option>
            </select>
          </div>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <button
            className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-200 text-sm font-semibold text-slate-800 drop-shadow-sm hover:scale-105'
            onClick={() => close()}
          >
            취소
          </button>
          <button className='h-[2.75rem] w-[7.75rem] rounded-3xl border border-slate-400 bg-slate-600 text-white drop-shadow-sm hover:scale-105'>
            방 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
