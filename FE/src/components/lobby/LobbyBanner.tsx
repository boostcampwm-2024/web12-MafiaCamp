'use client';

import LottieFile from '@/../public/lottie/global.json';
import Lottie from 'lottie-react';

const LobbyBanner = () => {
  return (
    <div className='h-[31.25rem]'>
      <div className='absolute left-0 top-0 flex h-[31.25rem] w-full items-center justify-center bg-gradient-to-r from-slate-800/50 to-slate-600'>
        <div className='flex w-[67.5rem] flex-row items-center justify-between pt-10'>
          <div className='flex flex-col items-start gap-8'>
            <h2 className='text-3xl font-bold text-white'>
              <p>생성되어 있는 방에 들어가거나</p>
              <p>직접 방을 생성해 보세요!</p>
            </h2>
            <button className='h-[3.75rem] w-[11.25rem] rounded-2xl bg-white font-bold text-slate-800 hover:scale-105'>
              방 만들기
            </button>
          </div>
          <Lottie animationData={LottieFile} className='h-[22.5rem]' />
        </div>
      </div>
    </div>
  );
};

export default LobbyBanner;
