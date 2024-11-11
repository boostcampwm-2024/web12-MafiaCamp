'use client';

import LottieFile from '@/../public/lottie/welcome.json';
import Lottie from 'lottie-react';
import Image from 'next/image';

const SigninPanel = () => {
  return (
    <div className='flex w-[30rem] flex-col items-center rounded-3xl bg-slate-600/50 p-10 max-[512px]:w-full'>
      <Lottie animationData={LottieFile} className='h-[6.25rem]' />
      <h2 className='flex items-center gap-x-2 pt-5 text-2xl font-bold text-white max-[512px]:flex-col max-[400px]:text-xl'>
        MafiaCamp에 오신 것을 <span>환영합니다.</span>
      </h2>
      <p className='flex items-center gap-x-1 pt-2 text-sm text-slate-200 max-[512px]:flex-col'>
        MafiaCamp는 누구나 즐길 수 있는
        <span>온라인 화상 마피아 게임입니다.</span>
      </p>
      <div className='flex flex-col items-center gap-3 pt-10 text-sm font-semibold text-slate-800'>
        <button className='relative h-[2.875rem] w-[17.25rem] rounded-3xl bg-[#FFEB3B] hover:scale-105'>
          <Image
            className='absolute left-2 top-1 rounded-full'
            src='/common/kakao-talk-icon.png'
            alt='kakao-talk-icon'
            width={40}
            height={40}
          />
          <p>카카오로 로그인</p>
        </button>
        <button className='relative h-[2.875rem] w-[17.25rem] rounded-3xl bg-white hover:scale-105'>
          <Image
            className='absolute left-[1.125rem] top-3'
            src='/common/google-icon.png'
            alt='google-icon'
            width={20}
            height={20}
          />
          <p>구글로 로그인</p>
        </button>
      </div>
    </div>
  );
};

export default SigninPanel;