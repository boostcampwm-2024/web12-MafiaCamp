'use client';

import LottieFile from '@/../public/lottie/404.json';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex w-full flex-row items-center pt-12 max-[1080px]:flex-col'>
      <Lottie
        animationData={LottieFile}
        className='h-[31.25rem] max-[1080px]:h-[25rem]'
      />
      <div className='flex flex-col items-center text-nowrap'>
        <h2 className='text-3xl font-bold text-white max-[1080px]:text-2xl max-[540px]:text-base'>
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
        </h2>
        <div className='flex flex-col items-center pt-4 text-slate-100 max-[1080px]:text-sm'>
          <p>존재하지 않는 주소를 입력하셨거나,</p>
          <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
        </div>
        <div className='mt-12 flex flex-row items-center gap-4'>
          <Link
            className='flex h-10 w-[7.5rem] items-center justify-center rounded-3xl bg-white text-slate-800 hover:scale-105'
            href='/'
          >
            홈으로
          </Link>
          <button
            className='flex h-10 w-40 items-center justify-center rounded-3xl bg-slate-600/50 text-white hover:scale-105'
            onClick={() => router.back()}
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
