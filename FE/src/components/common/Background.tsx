'use client';

import LottieFile from '@/../public/lottie/star.json';
import Lottie from 'lottie-react';
import { usePathname } from 'next/navigation';

const Background = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/game')) {
    return (
      <div className='fixed left-0 top-0 -z-10 h-full w-full bg-slate-800' />
    );
  }

  return (
    <div className='fixed left-0 top-0 -z-10 flex h-full w-full flex-row items-center bg-slate-800'>
      <Lottie animationData={LottieFile} className='w-1/4' />
      <Lottie animationData={LottieFile} className='w-1/4' />
      <Lottie animationData={LottieFile} className='w-1/4' />
      <Lottie animationData={LottieFile} className='w-1/4' />
    </div>
  );
};

export default Background;
