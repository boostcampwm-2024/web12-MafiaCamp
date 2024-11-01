'use client';

import LottieFile from '@/../public/lottie/star.json';
import Lottie from 'lottie-react';

const Background = () => {
  return (
    <div className='fixed left-0 top-0 flex h-full w-full flex-row items-center bg-slate-800'>
      <Lottie animationData={LottieFile} className='w-1/4' />
      <Lottie animationData={LottieFile} className='w-1/4' />
      <Lottie animationData={LottieFile} className='w-1/4' />
      <Lottie animationData={LottieFile} className='w-1/4' />
    </div>
  );
};

export default Background;
